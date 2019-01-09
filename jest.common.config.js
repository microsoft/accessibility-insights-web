// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    clearMocks: true,

    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.jest.json',
        },
    },

    moduleDirectories: ['node_modules'],

    moduleFileExtensions: ['ts', 'js'],

    testPathIgnorePatterns: [],

    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/*.test.(ts|tsx|js)'],
    verbose: true,
};
