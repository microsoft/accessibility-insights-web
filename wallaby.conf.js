// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

module.exports = () => {
    return {
        files: [
            // Note: it's important that this be a superset of the jest config/setup files
            // that the boostrap function below transitively references.
            { pattern: 'node_modules/@types/**/*', instrument: false },
            'tsconfig.json',
            'src/**/*.+(ts|tsx|js)',
            { pattern: 'src/tests/unit/**/*.snap', instrument: false },
            '!src/tests/unit/**/*.test.+(ts|tsx)',
            '!src/tests/end-to-end/**',
        ],
        tests: [
            // 'src/tests/unit/**/*.test.+(ts|tsx)'
            'src/tests/unit/tests/common/url-parser.test.ts',
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: 'jest',
        setup: function(wallaby) {
            const jestConfig = require('./src/tests/unit/jest.config.js');
            jestConfig.transform = {}; // Wallaby uses its own typescript transformer
            wallaby.testFramework.configure();
        },
        workers: {
            initial: 1,
            regular: 1,
            restart: true,
        },
        debug: true,
    };
};
