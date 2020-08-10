// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
var common = require('../jest.common.config');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/end-to-end';

module.exports = {
    ...common,
    displayName: 'e2e tests',
    globalSetup: `${currentDir}/setup/global-setup.ts`,
    globalTeardown: `${currentDir}/setup/global-teardown.ts`,
    moduleFileExtensions: ['ts', 'tsx', 'json', 'js'],
    rootDir: rootDir,
    roots: [currentDir],
    reporters: [
        'default',
        [
            'jest-junit',
            { outputDirectory: '.', outputName: '<rootDir>/test-results/e2e/junit-e2e.xml' },
        ],
    ],
    setupFilesAfterEnv: [`${currentDir}/setup/test-setup.ts`],
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
    },
};
