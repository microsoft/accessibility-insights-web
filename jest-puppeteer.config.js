// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// cwd will be chosen by "npm run" to be the repository root
const extensionPath = `${process.cwd()}/drop/dev/extension/`;

module.exports = {
  launch: {
    // Headless doesn't support extensions, see https://github.com/GoogleChrome/puppeteer/issues/659
    headless: false,
    args: [
      // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  }
};
