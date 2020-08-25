/**
 * @packageDocumentation
 *
 * This module is where the state for the playground is managed. It is
 * responsible for loading the monaco editor, injecting the babel, and
 */

import type * as Monaco from 'monaco-editor';
import create from 'zustand';

import { invariant } from 'remirror/core';

class PlaygroundState {
  #monaco?: typeof Monaco;
  #editor?: typeof Monaco.editor;

  get monaco(): typeof Monaco {
    invariant(this.#monaco, {
      message:
        'Monaco editor was reference before being loaded. Please call `loadMonaco` method first.',
    });

    return this.#monaco;
  }

  get editor(): typeof Monaco.editor {
    return (this.#editor ??= this.monaco.editor);
  }

  /**
   * Load the monaco editor asynchronously. This
   */
  async loadMonaco() {
    this.#monaco = await import('monaco-editor');
  }

  /**
   * The function that is run when the editor is first created in order to
   * populate the editor types.
   */
  async populateEditorTypes(): void {
    // Loop through the prepared DTS_CACHE and add it to the list of cached
    // modules.
    for (const [packageName, dtsFileContents] of entries(DTS_CACHE)) {
      dtsCache[packageName] = dtsFileContents;
      addDtsFiles(packageName, dtsFileContents);
    }

    // Keeping this here for neatness rather than add it for every package.
    const relativePath = 'package.json';

    // Loop through the prepared TYPE_DEFINITION_MAP and add to the list of cached
    // modules.
    for (const [packageName, { packageJson, id }] of entries(
      TYPE_DEFINITION_MAP,
    )) {
      // The type acquisition script requires a special module id and this is
      // added so that we don't retrieve types  so that it doesn't run again.
      acquiredTypeDefinitions[id] = packageJson;

      // Add the stringified package.json file to the files in node modules.
      addLibraryToRuntime(
        packageName,
        getEditorFilePath({ packageName, relativePath }),
      );
    }
  }

  async loadBabel() {}
}

export const playgroundState = new PlaygroundState();

export const usePlaygroundState = create((_set) => ({
  state: playgroundState,
}));
