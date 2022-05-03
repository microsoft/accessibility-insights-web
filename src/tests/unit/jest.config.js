// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var baseConfig = require('../../../jest.config.base');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/unit';

module.exports = {
    ...baseConfig,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/test-results/unit/coverage',
    displayName: 'unit tests',
    moduleDirectories: [...baseConfig.moduleDirectories, 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    reporters: [
        'default',
        'github-actions',
        [
            'jest-junit',
            { outputDirectory: '<rootDir>/test-results/unit/', outputName: 'junit.xml' },
        ],
    ],
    rootDir: rootDir,
    roots: [currentDir],
    setupFiles: [`${currentDir}/jest-setup.ts`],
    testEnvironment: 'jsdom',
    testMatch: [`${currentDir}/**/*.test.(ts|tsx|js)`],
};
