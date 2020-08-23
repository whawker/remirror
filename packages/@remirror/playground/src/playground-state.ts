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

  get monaco(): typeof Monaco {
    invariant(this.#monaco, {
      message:
        'Monaco editor was reference before being loaded. Please call `loadMonaco` method first.',
    });
    return this.#monaco;
  }

  /**
   * Load the monaco editor asynchronously. This
   */
  async loadMonaco() {
    this.#monaco = await import('monaco-editor');
  }

  async loadBabel() {}
}

export const playgroundState = new PlaygroundState();

export const usePlaygroundState = create((_set) => ({
  state: playgroundState,
}));
