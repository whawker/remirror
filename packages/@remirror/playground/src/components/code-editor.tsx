/**
 * @packageDocumentation
 *
 * This file contains the code editor which is used to render the playground
 * code when in advanced mode. It has quite a large footprint, requiring the
 * loading of multiple dts files.
 *
 * This code editor will be loaded asynchronously due to it's size. It will provide the editor
 */

import React from 'react';
import MonacoEditor from 'react-monaco-editor';

/**
 * This editor is a shallow wrapper around the monaco editor. It should be
 * loaded only when required as it requires a lot.
 */
export const PlaygroundMonacoEditor = () => {
  return (
    <div>
      <MonacoEditor width='100%' height='100%' />
    </div>
  );
};
