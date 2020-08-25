import {
  ApplySchemaAttributes,
  CommandFunction,
  ErrorConstant,
  extensionDecorator,
  ExtensionTag,
  getMarkRange,
  getMatchString,
  invariant,
  isElementDomNode,
  isMarkActive,
  MarkExtension,
  MarkExtensionSpec,
  MarkGroup,
  markPasteRule,
  noop,
  object,
  RangeParameter,
  removeMark,
  replaceText,
} from '@remirror/core';
import type { SuggestCharacterEntryMethod, Suggester } from '@remirror/pm/suggest';
import {
  escapeChar,
  getRegexPrefix,
  isInvalidSplitReason,
  isRemovedReason,
  isSelectionExitReason,
  isSplitReason,
  regexToString,
} from '@remirror/pm/suggest';

import type {
  MentionAtomExtensionAttributes,
  MentionAtomExtensionSuggestCommand,
  MentionAtomOptions,
  MentionCharacterEntryMethod,
  MentionKeyBinding,
  SuggestionCommandAttributes,
} from './mention-types';
import {
  DEFAULT_MATCHER,
  getAppendText,
  getMatcher,
  isValidMentionAttributes,
} from './mention-utils';

/**
 * This is the node version of the already popular mention extension. It
 * provides mentions as uneditable nodes.
 */
@extensionDecorator<MentionAtomOptions>({
  defaultOptions: {
    mentionTag: 'a' as const,
    matchers: [],
    appendText: ' ',
    suggestTag: 'a' as const,
    noDecorations: false,
  },
  handlerKeys: ['onChange', 'onExit', 'onCharacterEntry'],
  handlerKeyOptions: { onCharacterEntry: { earlyReturnValue: true } },
  staticKeys: ['matchers', 'mentionTag'],
  customHandlerKeys: ['keyBindings'],
})
export class MentionAtomExtension extends MarkExtension<MentionAtomOptions> {
  get name() {
    return 'mentionAtom' as const;
  }

  readonly tags = [ExtensionTag.InlineNode];

  /**
   * The compiled keybindings.
   */
  private readonly keyBindings: MentionKeyBinding = {};

  createMarkSpec(extra: ApplySchemaAttributes): MarkExtensionSpec {
    const dataAttributeId = 'data-mention-id';
    const dataAttributeName = 'data-mention-name';

    return {
      attrs: {
        ...extra.defaults(),
        id: {},
        label: {},
        name: {},
      },
      group: MarkGroup.Behavior,
      excludes: '_',
      inclusive: false,
      parseDOM: [
        {
          tag: `${this.options.mentionTag}[${dataAttributeId}]`,
          getAttrs: (node) => {
            if (!isElementDomNode(node)) {
              return false;
            }

            const id = node.getAttribute(dataAttributeId);
            const name = node.getAttribute(dataAttributeName);
            const label = node.textContent;
            return { ...extra.parse(node), id, label, name };
          },
        },
      ],
      toDOM: (node) => {
        const {
          label: _,
          id,
          name,
          replacementType,
          range,
          ...attributes
        } = node.attrs as Required<MentionAtomExtensionAttributes>;
        const matcher = this.options.matchers.find((matcher) => matcher.name === name);

        const mentionClassName = matcher
          ? matcher.mentionClassName ?? DEFAULT_MATCHER.mentionClassName
          : DEFAULT_MATCHER.mentionClassName;

        return [
          this.options.mentionTag,
          {
            ...extra.dom(node),
            ...attributes,
            class: name ? `${mentionClassName} ${mentionClassName}-${name}` : mentionClassName,
            [dataAttributeId]: id,
            [dataAttributeName]: name,
          },
          0,
        ];
      },
    };
  }

  createCommands() {
    return {
      /**
       * Create a new mention
       */
      createMention: this.createMention({ shouldUpdate: false }),

      /**
       * Update an existing mention.
       */
      updateMention: this.createMention({ shouldUpdate: true }),

      /**
       * Remove the mention(s) at the current selection or provided range.
       */
      removeMention: ({ range }: Partial<RangeParameter> = object()) =>
        removeMark({ type: this.type, expand: true, range }),
    };
  }

  createPasteRules() {
    return this.options.matchers.map((matcher) => {
      const { startOfLine, char, supportedCharacters, name } = {
        ...DEFAULT_MATCHER,
        ...matcher,
      };

      const regexp = new RegExp(
        `(${getRegexPrefix(startOfLine)}${escapeChar(char)}${regexToString(supportedCharacters)})`,
        'g',
      );

      return markPasteRule({
        regexp,
        type: this.type,
        getAttributes: (string) => ({
          id: getMatchString(string.slice(char.length, string.length)),
          label: getMatchString(string),
          name,
        }),
      });
    });
  }

  createSuggesters() {
    return this.options.matchers.map<Suggester<MentionAtomExtensionSuggestCommand>>((matcher) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const extension = this;

      return {
        ...DEFAULT_MATCHER,
        ...matcher,

        // The following properties are provided as getter so that the
        // prosemirror-suggest plugin always references the latest version of
        // the suggestion. This is not a good idea and should be fixed in a
        // better way soon.
        get noDecorations() {
          return extension.options.noDecorations;
        },

        get suggestTag() {
          return extension.options.suggestTag;
        },

        onChange: this.options.onChange,
        onExit: this.options.onExit,

        createCommand: ({ match, reason, setMarkRemoved }) => {
          const { range, suggester } = match;
          const { name } = suggester;
          const createMention = this.store.getCommands().createMention;
          const updateMention = this.store.getCommands().updateMention;
          const removeMention = this.store.getCommands().removeMention;
          const isActive = isMarkActive({
            from: range.from,
            to: range.end,
            type: this.type,
            stateOrTransaction: this.store.getState(),
          });

          const method = isActive ? updateMention : createMention;
          const isSplit = isSplitReason(reason);
          const isInvalid = isInvalidSplitReason(reason);
          const isRemoved = isRemovedReason(reason);
          const isSelectionExit = isSelectionExitReason(reason);

          const remove = () => {
            setMarkRemoved();

            try {
              // This might fail when a deletion has taken place.
              isInvalid ? removeMention({ range }) : noop();
            } catch {
              // This sometimes fails and it's best to ignore until more is
              // known about the impact. Please create an issue if this blocks
              // you in some way.
            }
          };

          const update = ({
            replacementType = isSplit ? 'partial' : 'full',
            id = match.queryText[replacementType],
            label = match.matchText[replacementType],
            appendText = this.options.appendText,
            ...attributes
          }: SuggestionCommandAttributes) => {
            method({
              id,
              label,
              appendText,
              replacementType,
              name,
              range,
              keepSelection: isSelectionExit,
              ...attributes,
            });
          };

          const command: MentionAtomExtensionSuggestCommand =
            isInvalid || isRemoved ? remove : update;

          return command;
        },
      };
    });
  }

  /**
   * The factory method for mention commands to update and create new mentions.
   */
  private createMention({ shouldUpdate }: CreateMentionParameter) {
    return (
      config: MentionAtomExtensionAttributes & { keepSelection?: boolean },
    ): CommandFunction => {
      invariant(isValidMentionAttributes(config), {
        message: 'Invalid configuration attributes passed to the MentionAtomExtension command.',
      });

      const { range, appendText, replacementType, keepSelection, ...attributes } = config;
      let name = attributes.name;

      if (!name) {
        invariant(this.options.matchers.length < 2, {
          code: ErrorConstant.EXTENSION,
          message:
            'The MentionAtomExtension command must specify a name since there are multiple matchers configured',
        });

        name = this.options.matchers[0].name;
      }

      const allowedNames = this.options.matchers.map(({ name }) => name);

      invariant(allowedNames.includes(name), {
        code: ErrorConstant.EXTENSION,
        message: `The name '${name}' specified for this command is invalid. Please choose from: ${JSON.stringify(
          allowedNames,
        )}.`,
      });

      const matcher = getMatcher(name, this.options.matchers);

      invariant(matcher, {
        code: ErrorConstant.EXTENSION,
        message: `Mentions matcher not found for name ${name}.`,
      });

      return (parameter) => {
        const { tr } = parameter;
        const { from, to } = range ?? tr.selection;

        if (shouldUpdate) {
          // Remove mark at previous position
          let { oldFrom, oldTo } = { oldFrom: from, oldTo: range ? range.end : to };
          const $oldTo = tr.doc.resolve(oldTo);

          ({ from: oldFrom, to: oldTo } = getMarkRange($oldTo, this.type) || {
            from: oldFrom,
            to: oldTo,
          });

          tr.removeMark(oldFrom, oldTo, this.type).setMeta('addToHistory', false);

          // Remove mark at current position
          const $newTo = tr.selection.$from;
          const { from: newFrom, to: newTo } = getMarkRange($newTo, this.type) || {
            from: $newTo.pos,
            to: $newTo.pos,
          };

          tr.removeMark(newFrom, newTo, this.type).setMeta('addToHistory', false);
        }

        return replaceText({
          keepSelection,
          type: this.type,
          attrs: { ...attributes, name },
          appendText: getAppendText(appendText, matcher.appendText),
          range: range
            ? { from, to: replacementType === 'full' ? range.end || to : to }
            : undefined,
          content: attributes.label,
        })(parameter);
      };
    };
  }
}

interface CreateMentionParameter {
  /**
   * Whether the mention command should handle updates.
   */
  shouldUpdate: boolean;
}
