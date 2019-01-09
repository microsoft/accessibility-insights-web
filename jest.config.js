// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var common = require('./jest.common.config');

module.exports = {
  ...common,
    coverageDirectory: 'coverage',
    setupFiles: ['<rootDir>/src/tests/unit/jest-setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    roots: ['<rootDir>/src/tests/unit'],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/tests/**'],
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
    reporters: ['default', 'jest-junit'],
    testEnvironment: 'jsdom',
};
