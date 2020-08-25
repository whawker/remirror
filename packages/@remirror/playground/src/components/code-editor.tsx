/**
 * @packageDocumentation
 *
 * This file contains the code editor which is used to render the playground
 * code when in advanced mode. It has quite a large footprint, requiring the
 * loading of multiple dts files.
 *
 * This code editor will be loaded asynchronously due to it's size. It will provide the editor
 */

import React, { FC } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';

import { usePlaygroundState } from '../playground-state';

/**
 * This editor is a shallow wrapper around the monaco editor. It should be
 * loaded only when required as it requires a lot.
 */
export const PlaygroundCodeEditor: FC<PlaygroundCodeEditorProps> = () => {
  return (
    <div>
      <MonacoEditor width='100%' height='100%' />
    </div>
  );
};

export interface PlaygroundCodeEditorProps {}
