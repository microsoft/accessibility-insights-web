// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
var common = require('../jest.common.config');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/end-to-end';

module.exports = {
    ...common,
    displayName: 'e2e tests',
    // using js instead of ts files since globalSetup & globalTeardown files are not transformed. refer https://github.com/facebook/jest/issues/5164
    globalSetup: `${currentDir}/setup/global-setup.js`,
    globalTeardown: `${currentDir}/setup/global-teardown.js`,
    moduleFileExtensions: [
        'ts',
        'json', // adding json, since puppeteer.launch throws error - refer https://github.com/GoogleChrome/puppeteer/issues/2754
        'js',
    ],
    rootDir: rootDir,
    roots: ['<rootDir>/src/tests/end-to-end'],
    reporters: ['default', ['jest-junit', { outputDirectory: '.', outputName: '<rootDir>/test-results/e2e/junit-e2e.xml' }]],
    setupFilesAfterEnv: [`${currentDir}/setup/test-setup.ts`],
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
    },
};
