# @remirror/preset-react

> The core preset providing the functionality you need and want.

[![Version][version]][npm] [![Weekly Downloads][downloads-badge]][npm] [![Bundled size][size-badge]][size] [![Typed Codebase][typescript]](#) [![MIT License][license]](#)

[version]: https://flat.badgen.net/npm/v/@remirror/preset-react/next
[npm]: https://npmjs.com/package/@remirror/preset-react/v/next
[license]: https://flat.badgen.net/badge/license/MIT/purple
[size]: https://bundlephobia.com/result?p=@remirror/preset-react@next
[size-badge]: https://flat.badgen.net/bundlephobia/minzip/@remirror/preset-react@next
[typescript]: https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label
[downloads-badge]: https://badgen.net/npm/dw/@remirror/preset-react/red?icon=npm

<br />

## Installation

```bash
# yarn
yarn add @remirror/preset-react@next @remirror/pm@next

# pnpm
pnpm add @remirror/preset-react@next @remirror/pm@next

# npm
npm install @remirror/preset-react@next @remirror/pm@next
```

This package is available via `remirror/preset/react` when you install `remirror`.

<br />

## Usage

This preset adds

- Server side support for nodes and marks.
- Transformations for server side components.
- Placeholder support for the editor.

```ts
import { RemirrorManager } from 'remirror/core';
import { CorePreset } from 'remirror/preset/core';
import { ReactPreset } from 'remirror/preset/react';

const reactPreset = new ReactPreset({ rootContent: 'block*' });

// Create the preset
const reactPreset = new ReactPreset(transformers);

// Create the Editor Manager with the required preset.
const manager = RemirrorManager.create([reactPreset]);
```

The `useManager` hook automatically includes both the `CorePreset` and the `ReactPreset` so you may never need to reference this package directly.
