import { promises as fsp } from 'fs';
import { resolve, join } from 'path';
import { format, resolveConfig } from 'prettier';
import { Logger } from 'tslog';

const { writeFile, readdir } = fsp;

// Create the logger which is used for the purpose of debugging.
const log = new Logger({ name: 'playground:imports' });
log.info('Starting the playground:imports script.');

// @ts-ignore
// This is needed to fake a browser environment.
global.WebSocket = class {};

/**
 * Resolve the provided path relative to the base directory of this project.
 */
function baseDir(...paths: string[]) {
  return resolve(__dirname, '../../../', ...paths);
}

/**
 * Check the imports in order to obtain the
 */
async function scanImportsFrom<T extends RemirrorModuleMeta>(
  sourceFolder: string,
  sourceModulePath: string,
  callback: (meta: RemirrorModuleMeta) => Promise<T>,
): Promise<{ [key: string]: T }> {
  const result: { [key: string]: T } = {};
  const folders = await readdir(sourceFolder);

  // Loop through the folders and extra the required data.
  for (const folder of folders) {
    const path = join(sourceFolder, folder);
    const packageJson = require(`${path}/package.json`);
    const mainPath = resolve(path, packageJson.main);

    const mainExport = require(mainPath);

    const meta: RemirrorModuleMeta = {
      name: `${sourceModulePath}/${folder}`,
      exports: Object.keys(mainExport),
    };

    result[folder] = await callback(meta);
  }

  return result;
}

/**
 * Import the extension. This is a separate function to allow for future changes
 * in the API.
 */
async function importExtension(meta: RemirrorModuleMeta) {
  return meta;
}

async function importPreset(meta: RemirrorModuleMeta) {
  return meta;
}

interface RemirrorModuleMeta {
  /**
   * The name of the module which will be used for the `package.json`.
   */
  name: string;

  /**
   * The exports from the module.
   */
  exports: string[];
}

interface RemirrorModuleMap {
  [key: string]: RemirrorModuleMeta;
}

interface Everything {
  extensions: RemirrorModuleMap;
  presets: RemirrorModuleMap;
}

/**
 * This generates the file in order to be worked with.
 */
function generateCode({ extensions, presets }: Everything) {
  // import * as remirrorCore from 'remirror/core';
  // 'remirror/core': remirrorCore,

  const extensionsAndPresets: RemirrorModuleMeta[] = [
    ...Object.values(extensions),
    ...Object.values(presets),
  ];
  const imports = extensionsAndPresets.map((meta) => {
    return `${JSON.stringify(meta.name)}: require(${JSON.stringify(meta.name)})`;
  });

  return `\
/**
 * @module
 *
 * DO NOT EDIT: AUTO-GENERATED FILE
 * @see \`@remirror/playground/scripts/import-remirror.ts\`
 */

import { useRemirrorPlayground } from './use-remirror-playground';

export const IMPORT_CACHE: { [moduleName: string]: any } = {
  // Automatically imported modules made available to the cache.
  ${imports.join(',\n  ')},

  // The following files are manually imported
  remirror: require('remirror'),
  'remirror/core': require('remirror/core'),
  'remirror/react': require('remirror/react'),
  'remirror/react/social': require('remirror/react/social'),
  'remirror/react/wysiwyg': require('remirror/react/wysiwyg'),
  '@remirror/dev': require('@remirror/dev'),
  '@remirror/playground': { useRemirrorPlayground },
  '@remirror/pm/commands': require('@remirror/pm/commands'),
  '@remirror/pm/dropcursor': require('@remirror/pm/dropcursor'),
  '@remirror/pm/gapcursor': require('@remirror/pm/gapcursor'),
  '@remirror/pm/history': require('@remirror/pm/history'),
  '@remirror/pm/inputrules': require('@remirror/pm/inputrules'),
  '@remirror/pm/keymap': require('@remirror/pm/keymap'),
  '@remirror/pm/model': require('@remirror/pm/model'),
  '@remirror/pm/schema-list': require('@remirror/pm/schema-list'),
  '@remirror/pm/state': require('@remirror/pm/state'),
  '@remirror/pm/suggest': require('@remirror/pm/suggest'),
  '@remirror/pm/tables': require('@remirror/pm/tables'),
  '@remirror/pm/transform': require('@remirror/pm/transform'),
  '@remirror/pm/view': require('@remirror/pm/view'),

  // External dependencies
  '@babel/runtime/helpers/interopRequireDefault': require('@babel/runtime/helpers/interopRequireDefault'),
  '@babel/runtime/helpers/interopRequireWildcard': require('@babel/runtime/helpers/interopRequireWildcard'),
  '@babel/runtime/helpers/slicedToArray': require('@babel/runtime/helpers/slicedToArray'),
  '@babel/runtime/helpers/createClass': require('@babel/runtime/helpers/createClass'),
  '@babel/runtime/helpers/possibleConstructorReturn': require('@babel/runtime/helpers/possibleConstructorReturn'),
  '@babel/runtime/helpers/extends': require('@babel/runtime/helpers/extends'),
  '@babel/runtime/helpers/assertThisInitialized': require('@babel/runtime/helpers/assertThisInitialized'),
  '@babel/runtime/helpers/classCallCheck': require('@babel/runtime/helpers/classCallCheck'),
  '@babel/runtime/helpers/inherits': require('@babel/runtime/helpers/inherits'),
  '@babel/runtime/helpers/defineProperty': require('@babel/runtime/helpers/defineProperty'),
  react: require('react'),
};

export const INTERNAL_MODULES: Array<{ moduleName: string, exports: string[] }> = [
  ${extensionsAndPresets
    .map((meta) => JSON.stringify({ moduleName: meta.name, exports: meta.exports }, null, 2))
    .join(',\n  ')}
];
`;
}

function forceTermination() {
  const timeout = global.setTimeout(() => {
    log.error(
      "I'm just a script, and far be it for me to tell you your job, dear human, but it seems to me that something has been keeping me alive for the last 5,000,000 nanoseconds (which feels like an eternity to me) since I completed my task. Maybe something opened a network connection? Who knows. Either way, it doesn't seem right, so I'm going to go ahead and exit",
    );
    process.exit(0);
  }, 5000);

  timeout.unref();
  log.info('Success!');
}

// The extension and preset folders for the top level exports.
const extensionFolder = baseDir('remirror', 'extension');
const presetFolder = baseDir('remirror', 'extension');

// Where the generated file will be located.
const outputFilePath = baseDir('@remirror', 'playground', 'src', '_remirror.tsx');

/**
 * This is the function run when the script is called, as is convention in other
 * languages.
 */
async function main() {
  // TODO: rewrite this to walk everything inside `packages/remirror`; ignore
  // `dist` and `src; populate `execute.ts`'s `knownRequires` and handle the
  // TypeScript definitions.
  const extensions = await scanImportsFrom(extensionFolder, 'remirror/extension', importExtension);
  const presets = await scanImportsFrom(presetFolder, 'remirror/preset', importPreset);
  const everything: Everything = { extensions, presets };

  // Generate the code and format it with prettier.
  const generatedCode = generateCode(everything);
  const prettierConfig = await resolveConfig(outputFilePath);
  const formattedCode = format(generatedCode, {
    filepath: outputFilePath,
    parser: 'typescript',
    ...prettierConfig,
  });

  // Write to the formatted code to the output path for consumption by the rest
  // of the playground.
  await writeFile(outputFilePath, formattedCode);

  forceTermination();
}

// Run the script but listen for errors.
main().catch((error) => {
  log.fatal(error);
  process.exit(1);
});
