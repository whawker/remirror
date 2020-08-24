import type { editor } from 'monaco-editor';

export type ThemeTuple = [string, editor.IStandaloneThemeData];

/**
 * The theme to use when in dark mode for the website.
 *
 * Taken from https://github.com/brijeshb42/monaco-themes/blob/master/themes/Oceanic%20Next.json
 */
export const darkTheme: ThemeTuple = [
  'darkTheme',
  {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        background: '#1B2B34',
        token: '',
      },
      {
        foreground: '#65737e',
        token: 'comment',
      },
      {
        foreground: '#65737e',
        token: 'punctuation.definition.comment',
      },
      {
        foreground: '#cdd3de',
        token: 'variable',
      },
      {
        foreground: '#c795ff',
        token: 'keyword',
      },
      {
        foreground: '#ff91a2',
        token: 'type.identifier',
      },
      {
        foreground: '#44bdff',
        token: 'identifier',
      },
      {
        foreground: '#fefffe',
        token: 'delimiter.bracket',
      },
      {
        foreground: '#ffc568',
        token: 'delimiter.angle',
        fontStyle: '',
      },
      {
        foreground: '#ffc568',
        token: 'delimiter.parenthesis',
        fontStyle: '',
      },
      {
        foreground: '#ffc568',
        token: 'delimiter',
      },
      {
        foreground: '#7887d5',
        token: 'comment',
        fontStyle: 'italic',
      },
      {
        foreground: '#7887d5',
        token: 'comment.doc.ts',
      },
      {
        foreground: '#c795ff',
        token: 'storage.type',
      },
      {
        foreground: '#c795ff',
        token: 'storage.modifier',
      },
      {
        foreground: '#5fb3b3',
        token: 'keyword.operator',
      },
      {
        foreground: '#5fb3b3',
        token: 'constant.other.color',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation',
      },
      {
        foreground: '#5fb3b3',
        token: 'meta.tag',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.definition.tag',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.separator.inheritance.php',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.definition.tag.html',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.definition.tag.begin.html',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.definition.tag.end.html',
      },
      {
        foreground: '#5fb3b3',
        token: 'punctuation.section.embedded',
      },
      {
        foreground: '#5fb3b3',
        token: 'keyword.other.template',
      },
      {
        foreground: '#5fb3b3',
        token: 'keyword.other.substitution',
      },
      {
        foreground: '#eb606b',
        token: 'entity.name.tag',
      },
      {
        foreground: '#eb606b',
        token: 'meta.tag.sgml',
      },
      {
        foreground: '#eb606b',
        token: 'markup.deleted.git_gutter',
      },
      {
        foreground: '#6699cc',
        token: 'entity.name.function',
      },
      {
        foreground: '#6699cc',
        token: 'meta.function-call',
      },
      {
        foreground: '#6699cc',
        token: 'variable.function',
      },
      {
        foreground: '#6699cc',
        token: 'support.function',
      },
      {
        foreground: '#6699cc',
        token: 'keyword.other.special-method',
      },
      {
        foreground: '#6699cc',
        token: 'meta.block-level',
      },
      {
        foreground: '#f2777a',
        token: 'support.other.variable',
      },
      {
        foreground: '#f2777a',
        token: 'string.other.link',
      },
      {
        foreground: '#f99157',
        token: 'constant.numeric',
      },
      {
        foreground: '#f99157',
        token: 'constant.language',
      },
      {
        foreground: '#f99157',
        token: 'support.constant',
      },
      {
        foreground: '#f99157',
        token: 'constant.character',
      },
      {
        foreground: '#f99157',
        token: 'variable.parameter',
      },
      {
        foreground: '#f99157',
        token: 'keyword.other.unit',
      },
      {
        foreground: '#b8e780',
        fontStyle: 'normal',
        token: 'string',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'constant.other.symbol',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'constant.other.key',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'markup.heading',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'markup.inserted.git_gutter',
      },
      {
        foreground: '#99c794',
        fontStyle: 'normal',
        token: 'meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js',
      },
      {
        foreground: '#fac863',
        token: 'entity.name.class',
      },
      {
        foreground: '#fac863',
        token: 'entity.name.type.class',
      },
      {
        foreground: '#fac863',
        token: 'support.type',
      },
      {
        foreground: '#fac863',
        token: 'support.class',
      },
      {
        foreground: '#fac863',
        token: 'support.orther.namespace.use.php',
      },
      {
        foreground: '#fac863',
        token: 'meta.use.php',
      },
      {
        foreground: '#fac863',
        token: 'support.other.namespace.php',
      },
      {
        foreground: '#fac863',
        token: 'markup.changed.git_gutter',
      },
      {
        foreground: '#ec5f67',
        token: 'entity.name.module.js',
      },
      {
        foreground: '#ec5f67',
        token: 'variable.import.parameter.js',
      },
      {
        foreground: '#ec5f67',
        token: 'variable.other.class.js',
      },
      {
        foreground: '#ec5f67',
        fontStyle: 'italic',
        token: 'variable.language',
      },
      {
        foreground: '#cdd3de',
        token: 'meta.group.braces.curly.js constant.other.object.key.js string.unquoted.label.js',
      },
      {
        foreground: '#d8dee9',
        token: 'meta.class-method.js entity.name.function.js',
      },
      {
        foreground: '#d8dee9',
        token: 'variable.function.constructor',
      },
      {
        foreground: '#d8dee9',
        token:
          'meta.class.js meta.class.property.js meta.method.js string.unquoted.js entity.name.function.js',
      },
      {
        foreground: '#bb80b3',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#99c794',
        token: 'markup.inserted',
      },
      {
        foreground: '#ec5f67',
        token: 'markup.deleted',
      },
      {
        foreground: '#bb80b3',
        token: 'markup.changed',
      },
      {
        foreground: '#5fb3b3',
        token: 'string.regexp',
      },
      {
        foreground: '#5fb3b3',
        token: 'constant.character.escape',
      },
      {
        fontStyle: 'underline',
        token: '*url*',
      },
      {
        fontStyle: 'underline',
        token: '*link*',
      },
      {
        fontStyle: 'underline',
        token: '*uri*',
      },
      {
        foreground: '#ab7967',
        token: 'constant.numeric.line-number.find-in-files - match',
      },
      {
        foreground: '#99c794',
        token: 'entity.name.filename.find-in-files',
      },
      {
        foreground: '#6699cc',
        fontStyle: 'italic',
        token: 'tag.decorator.js entity.name.tag.js',
      },
      {
        foreground: '#6699cc',
        fontStyle: 'italic',
        token: 'tag.decorator.js punctuation.definition.tag.js',
      },
      {
        foreground: '#ec5f67',
        fontStyle: 'italic',
        token: 'source.js constant.other.object.key.js string.unquoted.label.js',
      },
      {
        foreground: '#fac863',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#fac863',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#c795ff',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#c795ff',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#d8dee9',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#d8dee9',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#6699cc',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#6699cc',
        token:
          'source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#ab7967',
        token:
          'source.json meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#ab7967',
        token:
          'source.json meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#ec5f67',
        token:
          'source.json meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#ec5f67',
        token:
          'source.json meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#f99157',
        token:
          'source.json meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#f99157',
        token:
          'source.json meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#fac863',
        token:
          'source.json meta meta.structure.dictionary.json string.quoted.double.json - meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#fac863',
        token:
          'source.json meta meta.structure.dictionary.json punctuation.definition.string - meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
      {
        foreground: '#c795ff',
        token:
          'source.json meta.structure.dictionary.json string.quoted.double.json - meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json',
      },
      {
        foreground: '#c795ff',
        token:
          'source.json meta.structure.dictionary.json punctuation.definition.string - meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string',
      },
    ],
    colors: {
      'editor.foreground': '#CDD3DE',
      'editor.background': '#222437',
      'editor.selectionBackground': '#4f5b66',
      'editor.lineHighlightBackground': '#65737e55',
      'editorCursor.foreground': '#c0c5ce',
      'editorWhitespace.foreground': '#51525a',
      'editorIndentGuide.background': '#65737F',
      'editorIndentGuide.activeBackground': '#FBC95A',
    },
  },
];

/**
 * The light theme to use.
 *
 * Taken from: https://github.com/brijeshb42/monaco-themes/blob/master/themes/GitHub.json
 */
export const lightTheme = [
  'lightTheme',
  {
    base: 'vs',
    inherit: true,
    rules: [
      {
        background: '#F8F8FF',
        token: '',
      },
      {
        foreground: '#999988',
        fontStyle: 'italic',
        token: 'comment',
      },
      {
        foreground: '#999999',
        fontStyle: 'bold',
        token: 'comment.block.preprocessor',
      },
      {
        foreground: '#999999',
        fontStyle: 'bold italic',
        token: 'comment.documentation',
      },
      {
        foreground: '#999999',
        fontStyle: 'bold italic',
        token: 'comment.block.documentation',
      },
      {
        foreground: '#a61717',
        background: '#e3d2d2',
        token: 'invalid.illegal',
      },
      {
        fontStyle: 'bold',
        token: 'keyword',
      },
      {
        fontStyle: 'bold',
        token: 'storage',
      },
      {
        fontStyle: 'bold',
        token: 'keyword.operator',
      },
      {
        fontStyle: 'bold',
        token: 'constant.language',
      },
      {
        fontStyle: 'bold',
        token: 'support.constant',
      },
      {
        foreground: '#445588',
        fontStyle: 'bold',
        token: 'storage.type',
      },
      {
        foreground: '#445588',
        fontStyle: 'bold',
        token: 'support.type',
      },
      {
        foreground: '#008080',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#0086b3',
        token: 'variable.other',
      },
      {
        foreground: '#999999',
        token: 'variable.language',
      },
      {
        foreground: '#445588',
        fontStyle: 'bold',
        token: 'entity.name.type',
      },
      {
        foreground: '#445588',
        fontStyle: 'bold',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#445588',
        fontStyle: 'bold',
        token: 'support.class',
      },
      {
        foreground: '#008080',
        token: 'variable.other.constant',
      },
      {
        foreground: '#800080',
        token: 'constant.character.entity',
      },
      {
        foreground: '#990000',
        token: 'entity.name.exception',
      },
      {
        foreground: '#990000',
        token: 'entity.name.function',
      },
      {
        foreground: '#990000',
        token: 'support.function',
      },
      {
        foreground: '#990000',
        token: 'keyword.other.name-of-parameter',
      },
      {
        foreground: '#555555',
        token: 'entity.name.section',
      },
      {
        foreground: '#000080',
        token: 'entity.name.tag',
      },
      {
        foreground: '#008080',
        token: 'variable.parameter',
      },
      {
        foreground: '#008080',
        token: 'support.variable',
      },
      {
        foreground: '#009999',
        token: 'constant.numeric',
      },
      {
        foreground: '#009999',
        token: 'constant.other',
      },
      {
        foreground: '#dd1144',
        token: 'string - string source',
      },
      {
        foreground: '#dd1144',
        token: 'constant.character',
      },
      {
        foreground: '#009926',
        token: 'string.regexp',
      },
      {
        foreground: '#990073',
        token: 'constant.other.symbol',
      },
      {
        fontStyle: 'bold',
        token: 'punctuation',
      },
      {
        foreground: '#000000',
        background: '#ffdddd',
        token: 'markup.deleted',
      },
      {
        fontStyle: 'italic',
        token: 'markup.italic',
      },
      {
        foreground: '#aa0000',
        token: 'markup.error',
      },
      {
        foreground: '#999999',
        token: 'markup.heading.1',
      },
      {
        foreground: '#000000',
        background: '#ddffdd',
        token: 'markup.inserted',
      },
      {
        foreground: '#888888',
        token: 'markup.output',
      },
      {
        foreground: '#888888',
        token: 'markup.raw',
      },
      {
        foreground: '#555555',
        token: 'markup.prompt',
      },
      {
        fontStyle: 'bold',
        token: 'markup.bold',
      },
      {
        foreground: '#aaaaaa',
        token: 'markup.heading',
      },
      {
        foreground: '#aa0000',
        token: 'markup.traceback',
      },
      {
        fontStyle: 'underline',
        token: 'markup.underline',
      },
      {
        foreground: '#999999',
        background: '#eaf2f5',
        token: 'meta.diff.range',
      },
      {
        foreground: '#999999',
        background: '#eaf2f5',
        token: 'meta.diff.index',
      },
      {
        foreground: '#999999',
        background: '#eaf2f5',
        token: 'meta.separator',
      },
      {
        foreground: '#999999',
        background: '#ffdddd',
        token: 'meta.diff.header.from-file',
      },
      {
        foreground: '#999999',
        background: '#ddffdd',
        token: 'meta.diff.header.to-file',
      },
      {
        foreground: '#4183c4',
        token: 'meta.link',
      },
    ],
    colors: {
      'editor.foreground': '#000000',
      'editor.background': '#F8F8FF',
      'editor.selectionBackground': '#B4D5FE',
      'editor.lineHighlightBackground': '#FFFEEB',
      'editorCursor.foreground': '#666666',
      'editorWhitespace.foreground': '#BBBBBB',
    },
  },
];
