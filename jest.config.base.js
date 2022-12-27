// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/**/*.js',
        '<rootDir>/**/*.ts',
        '<rootDir>/**/*.tsx',
        '!<rootDir>/bundle/**',
        '!<rootDir>/dist/**',
        '!<rootDir>/drop/**',
        '!<rootDir>/extension/**',
        '!<rootDir>/out/**',
        '!<rootDir>/**/jest.config.js',
        '!<rootDir>/**/prettier.config.js',
        '!<rootDir>/**/webpack.config.js',
        '!<rootDir>/**/esbuild.js',
        '!<rootDir>/**/style-config.js',
        '!<rootDir>/**/node_modules/**',
        '!<rootDir>/**/test-results/**',
    ],
    coverageDirectory: '<rootDir>/test-results/unit/coverage',
    coverageReporters: ['text', 'lcov', 'cobertura'],
    displayName: '<should be overriden by individual jest.configs>',
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        /* Using proxy to handle css modules, as per: https://jestjs.io/docs/en/webpack#mocking-css-modules */
        '\\.(scss)$': `${__dirname}/src/tests/common/identity-obj-proxy`,
    },
    reporters: [
        'default',
        'github-actions',
        [
            'jest-junit',
            {
                outputDirectory: '<rootDir>/test-results/unit',
                outputName: 'junit.xml',
            },
        ],
    ],
    setupFilesAfterEnv: [`${__dirname}/src/tests/common/flush-promises-after-each-test.ts`],
    snapshotSerializers: [`${__dirname}/src/tests/common/typemoq-snapshot-serializer.ts`],
    testEnvironment: 'node',
    testMatch: ['**/*.spec.[tj]s', '**/*.test.[tj]s'],
    testPathIgnorePatterns: ['/dist/', '/out/'],
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': ['@swc/jest'],
    },
};
