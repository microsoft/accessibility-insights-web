// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

module.exports = wallaby => {
    return {
        files: [
            // Note: it's important that this be a superset of the jest config/setup files
            // that the boostrap function below transitively references.
            'tsconfig.json',
            'src/**/*.+(ts|tsx|js|json)',
            { pattern: 'src/tests/unit/**/*.snap', instrument: false },
            '!src/tests/unit/**/*.test.+(ts|tsx)',
            '!src/tests/end-to-end/**',
        ],
        tests: ['src/tests/unit/**/*.test.+(ts|tsx)'],
        env: {
            type: 'node',
            runner: 'node',
        },
        compilers: {
            '**/*.+(ts|tsx)': wallaby.compilers.typeScript({ module: 'commonjs' }),
        },
        testFramework: 'jest',
        setup: function(wallaby) {
            const jestConfig = require('./src/tests/unit/jest.config.js');

            // Wallaby uses its own typescript transformer and recommends disabling jest's to avoid double-compiling
            delete jestConfig.transform;

            // Normally, jest transforms jest-setup.ts to .js itself. Since we're suppressing jest's transform,
            // we need to redirect it to the wallaby-generated .js version ourselves
            jestConfig.setupFiles = jestConfig.setupFiles.map(filePath => filePath.replace(/\.ts$/, '.js'));

            // It looks like wallaby doesn't support jest-circus yet, so falling back to the default runner
            jestConfig.testRunner = 'jasmine2';

            wallaby.testFramework.configure(jestConfig);
        },
    };
};
