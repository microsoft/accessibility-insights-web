// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

module.exports = wallaby => {
    return {
        // Wallaby requires that this match all files that are transitively required to load/run our tests, including
        // config files/jest setup/test infra/product code. The exceptions are node_modules (which is special cased
        // implicitly by Wallaby) and files included in the tests property (which should be excluded here to avoid processing
        // them twice). Entries are read top-to-bottom, so later ones have precedence.
        files: [
            'tsconfig.json', // Used implicitly during compilation iff provided here
            'src/**/*.+(ts|tsx|js|json|snap)',
            '!src/tests/unit/**/*.test.+(ts|tsx)',
            '!src/tests/end-to-end/**',
        ],
        // This should be strictly files containing describe/test/it calls, not test infrastructure.
        tests: ['src/tests/unit/**/*.test.+(ts|tsx)'],
        env: {
            type: 'node',
            runner: 'node',
        },
        compilers: {
            // Wallaby uses tsconfig.json's settings for everything we don't explicitly override here. We need to use a
            // different module type than normal for compatibility with Wallaby's incremental instrumentation process.
            '**/*.+(ts|tsx)': wallaby.compilers.typeScript({ module: 'commonjs' }),
        },
        testFramework: 'jest',
        setup: function (wallaby) {
            const jestConfig = require('./src/tests/unit/jest.config.js');

            // Wallaby uses its own typescript transformer and recommends disabling jest's to avoid double-compiling.
            delete jestConfig.transform;

            // Normally, jest transforms jest-setup.ts to .js itself. Since we're suppressing jest's transform,
            // we need to redirect it to the wallaby-generated .js version ourselves.
            jestConfig.setupFiles = jestConfig.setupFiles.map(filePath =>
                filePath.replace(/\.ts$/, '.js'),
            );

            // It looks like wallaby doesn't support jest-circus yet, so falling back to the default runner.
            jestConfig.testRunner = 'jasmine2';

            wallaby.testFramework.configure(jestConfig);
        },
    };
};
