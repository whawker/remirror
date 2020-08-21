import * as crypto from 'crypto';
import { editor, languages } from 'monaco-editor';
import React, { FC, useContext, useEffect, useRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { entries } from 'remirror/core';

import { darkTheme } from './config/editor-themes';
import { PlaygroundContext, PlaygroundContextObject } from './context';
import { ErrorBoundary } from './error-boundary';
import { DTS_CACHE, TYPE_DEFINITION_MAP } from './generated/exports';
import { IMPORT_CACHE, INTERNAL_MODULES } from './generated/modules';
import { getEditorFilePath } from './playground-utils';
import { acquiredTypeDefinitions, dtsCache } from './vendor/type-acquisition';

// Start with these and cannot remove them
export const REQUIRED_MODULES = INTERNAL_MODULES.map((mod) => mod.moduleName);

const tsOptions: languages.typescript.CompilerOptions = {
  // Maybe need to do manual syntax highlighting like found here:
  // http://demo.rekit.org/element/src%2Ffeatures%2Feditor%2Fworkers%2FsyntaxHighlighter.js/code
  jsx: languages.typescript.JsxEmit.React,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  allowJs: true,
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictPropertyInitialization: true,
  strictBindCallApply: true,
  noImplicitThis: true,
  noImplicitReturns: true,
  useDefineForClassFields: false,
  alwaysStrict: true,
  allowUnreachableCode: false,
  allowUnusedLabels: false,
  downlevelIteration: false,
  noEmitHelpers: false,
  noLib: false,
  noStrictGenericChecks: false,
  noUnusedLocals: false,
  noUnusedParameters: false,
  preserveConstEnums: false,
  removeComments: false,
  skipLibCheck: false,
  declaration: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
  target: languages.typescript.ScriptTarget.ESNext,
  module: languages.typescript.ModuleKind.ESNext,
};

languages.typescript.typescriptDefaults.setCompilerOptions(tsOptions);
languages.typescript.javascriptDefaults.setCompilerOptions(tsOptions);

editor.defineTheme(...darkTheme);

/**
 * This method is used to add types to the monaco editor runtime.
 */
export function addLibraryToRuntime(code: string, path: string) {
  languages.typescript.typescriptDefaults.addExtraLib(code, path);
  // languages.typescript.typescriptDefaults.addExtraLib(code,
  // path.replace('node_modules/', ''));
}

const MATCHING_REGEX = /^@remirror\/(?:core|react|preset|extension)/;

/**
 * Add the `.d.ts` files for each package to the editor.
 */
function addDtsFiles(packageName: string, dtsFileContents: Record<string, string>) {
  // Loop through the dts paths and the dts contents of each endpoitn for this
  // package.
  for (const [relativePath, contents] of entries(dtsFileContents)) {
    // Add the pre compiled `.d.ts` file to the `node_modules` file system for
    // the monaco editor.
    addLibraryToRuntime(contents, getEditorFilePath({ packageName, relativePath, isDts: false }));
  }

  // Since all remirror packages have a certain pattern it is possible to know
  // if a package is included based the regex defined earlier.
  const isIncludedWithRemirror = MATCHING_REGEX.test(packageName);

  // When the package name is not included with remirror as a subdirectory
  // subdirectory of `remirror` then we can add it as it is.
  if (!isIncludedWithRemirror) {
    return;
  }

  // At this point we know the package is also exported as a subdirectory of
  // `remirror`. As a result we need to:
  // - Create the subdirectory name from the scoped name.
  // - Create contents for the subdirectory which point to the scoped name.
  // - Add both the scoped package name and subdirectory name to the monaco
  //   editor.

  // Get the end segment of the scoped name `@remirror/core-utils` =>
  // `core-utils`
  const [, endSegment] = packageName.split('/');

  // Convert the filename to a sub directory path which appends the
  // `index.d.ts` to make it the default entry point.
  const relativePath = `${endSegment.split('-').join('/')}/index.d.ts`;

  // Point the contents of the sub directory `remirror` import to the original
  // scoped package. e.g. `remirror/core/utils` would have a value of `export *
  // from '@remirror/core-utils';`
  const updatedContents = `export * from '${packageName}';`;

  // Add the subdirectory and it's contents to the monaco editor.
  addLibraryToRuntime(
    updatedContents,
    getEditorFilePath({
      packageName: 'remirror',
      relativePath,
      isDts: false,
    }),
  );
}

/**
 * The function that is run when the editor is first created in order to
 * populate the editor types.
 */
export function populateEditorTypes() {
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
  for (const [packageName, { packageJson, id }] of entries(TYPE_DEFINITION_MAP)) {
    // The type acquisition script requires a special module id and this is
    // added so that we don't retrieve types  so that it doesn't run again.
    acquiredTypeDefinitions[id] = packageJson;

    // Add the stringified package.json file to the files in node modules.
    addLibraryToRuntime(packageName, getEditorFilePath({ packageName, relativePath }));
  }
}

const fetchedModules: {
  [id: string]: {
    name: string;
    modulePromise: Promise<any>;
  };
} = {};

function hash(str: string): string {
  return `_${crypto.createHash('sha1').update(str).digest('hex')}`;
}

function bundle(moduleName: string, id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.addEventListener('load', () => {
      console.log(`LOADED ${moduleName}`);
      resolve((window as any)[id]);
    });
    el.addEventListener('error', (_event) => {
      // We cannot really get details from the event because browsers prevent
      // that for security reasons.
      reject(new Error(`Failed to load ${el.src}`));
    });
    el.src = `http://bundle.run/${encodeURIComponent(moduleName)}@latest?name=${encodeURIComponent(
      id,
    )}`;
    document.body.append(el);
  });
}

export async function makeRequire(requires: string[]) {
  const tasks: Array<Promise<void>> = [];
  const modules: { [moduleName: string]: any } = {};

  for (const moduleName of requires) {
    if (IMPORT_CACHE[moduleName]) {
      modules[moduleName] = IMPORT_CACHE[moduleName];
    } else {
      const id = hash(moduleName);

      if (!fetchedModules[id]) {
        fetchedModules[id] = {
          name: moduleName,
          modulePromise: bundle(moduleName, id),
        };
      }

      tasks.push(
        fetchedModules[id].modulePromise.then((remoteModule) => {
          modules[moduleName] = remoteModule;
        }),
      );
    }
  }

  await Promise.all(tasks);

  return function require(moduleName: string) {
    if (modules[moduleName]) {
      return modules[moduleName];
    }

    throw new Error(`Could not require('${moduleName}')`);
  };
}

/**
 * Fakes CommonJS stuff so that we can run the user code as if it were a
 * CommonJS module.
 */
function runCode(code: string, requireFn: (mod: string) => any) {
  const userModule = { exports: {} as any };
  eval(`(function userCode(require, module, exports) {${code}})`)(
    requireFn,
    userModule,
    userModule.exports,
  );

  return userModule;
}

function runCodeInDiv(
  div: HTMLDivElement,
  {
    code,
    requires,
    playground,
  }: { code: string; requires: string[]; playground: PlaygroundContextObject },
) {
  let active = true;

  (async function doIt() {
    try {
      // First do the requires.
      const requireFn = await makeRequire(requires);

      if (!active) {
        return;
      }

      // Then run the code to generate the React element
      const userModule = runCode(code, requireFn);
      const Component = userModule.exports.default || userModule.exports;

      // Then mount the React element into the div
      render(
        <ErrorBoundary>
          <PlaygroundContext.Provider value={playground}>
            <Component />
          </PlaygroundContext.Provider>
        </ErrorBoundary>,
        div,
      );
    } catch (error) {
      console.error(error);
      render(
        <div>
          <h1>Error occurred</h1>
          <pre>
            <code>{String(error)}</code>
          </pre>
        </div>,
        div,
      );
    }
  })();

  return () => {
    active = false;
    unmountComponentAtNode(div);
  };
}

export interface ExecuteProps {
  /** The JavaScript code to execute (in CommonJS syntax) */
  code: string;

  /** A list of the modules this code `require()`s */
  requires: string[];
}

/**
 * Executes the given `code`, mounting the React component that it exported (via
 * `export default`) into the DOM. Is automatically debounced to prevent
 * over-fetching npm modules during typing.
 */
export const Execute: FC<ExecuteProps> = function (props) {
  const { code, requires } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const playground = useContext(PlaygroundContext);
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const release = runCodeInDiv(ref.current, { code, requires, playground });
    return () => {
      release();
    };
  }, [code, requires, playground]);

  return <div ref={ref} style={{ height: '100%' }} />;
};
