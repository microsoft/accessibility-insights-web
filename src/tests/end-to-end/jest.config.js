// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const baseConfig = require('../../../jest.config.base');

const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/end-to-end';

module.exports = {
    ...baseConfig,
    collectCoverage: false,
    displayName: 'e2e tests',
    globalSetup: `${currentDir}/setup/global-setup.ts`,
    globalTeardown: `${currentDir}/setup/global-teardown.ts`,
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
        // Playwright requires this, but Jest's jsdom testEnvironment doesn't define it as of Jest 27
        setImmediate: callback => setTimeout(callback, 0),
    },
    moduleDirectories: [...baseConfig.moduleDirectories, 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'json', 'js'],
    reporters: [
        'default',
        'github-actions',
        [
            'jest-junit',
            { outputDirectory: '<rootDir>/test-results/e2e/', outputName: 'junit-e2e.xml' },
        ],
    ],
    rootDir: rootDir,
    roots: [currentDir],
    setupFilesAfterEnv: [...baseConfig.setupFilesAfterEnv, `${currentDir}/setup/test-setup.ts`],
    testEnvironment: 'jsdom',
};
