// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const baseConfig = require('../../src/tests/unit/jest.config');
const package = require('./package');

const rootDir = '../../';
const currentDir = '<rootDir>/packages/report-e2e-tests';
const resultDir = `<rootDir>/test-results/${package.name}`;

module.exports = {
    ...baseConfig,
    displayName: package.name,
    setupFiles: [],
    rootDir: rootDir,
    roots: [currentDir],
    collectCoverage: false,
    collectCoverageFrom: [],
    coverageDirectory: `${resultDir}/coverage`,
    testEnvironment: 'jsdom',
    testMatch: [`${currentDir}/**/*.test.(ts|tsx|js)`],
    reporters: [
        'default',
        [
            'jest-junit',
            { outputDirectory: '.', outputName: `${resultDir}/junit.xml` },
        ],
    ],
};
