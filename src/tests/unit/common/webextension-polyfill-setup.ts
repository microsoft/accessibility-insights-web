// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// webextension-polyfill errors on import if a global "chrome" variable is not defined
const mockChromeGlobalRequired = (window as any).chrome == null;
if (mockChromeGlobalRequired) {
    (window as any).chrome = { runtime: { id: 'mocked' } };
}

// This must be "require" and not "import" to avoid swc hoisting the statement above the window
// setup. See https://github.com/swc-project/swc/issues/1686 and
// https://github.com/microsoft/TypeScript/pull/39764
require('webextension-polyfill');

if (mockChromeGlobalRequired) {
    delete (window as any).chrome;
}
