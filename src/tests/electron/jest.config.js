// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
var common = require('../jest.common.config');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/electron';

module.exports = {
    ...common,
    displayName: 'electron tests',
    globalSetup: `${currentDir}/setup/global-setup.ts`,
    globalTeardown: `${currentDir}/setup/global-teardown.ts`,
    moduleFileExtensions: ['ts', 'js'],
    rootDir: rootDir,
    roots: [currentDir],
    reporters: ['default', ['jest-junit', { outputDirectory: '.', outputName: '<rootDir>/test-results/electron/junit-electron.xml' }]],
    setupFilesAfterEnv: [`${currentDir}/setup/test-setup.ts`],
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
    },
};
