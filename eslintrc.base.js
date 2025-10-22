// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked', // v8: renamed from recommended-requiring-type-checking
        'plugin:security/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module', // Allows for the use of imports
        projectService: true, // v8: replaces 'project' option
        tsconfigRootDir: __dirname, // v8: required for projectService
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020, // v8: updated from 8 to 2020
    },
    plugins: ['react', '@typescript-eslint', 'security', 'import'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        eqeqeq: ['error', 'always', { null: 'ignore' }],

        // Additional rules not enabled by default
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: 'typemoq',
                        importNames: ['GlobalMock', 'GlobalScope'],
                        message:
                            'typemoq Global mocks are incompatible with recent versions of @swc/core, see swc-project/swc#5151',
                    },
                ],
            },
        ],

        'no-throw-literal': 'error',
        'react/no-access-state-in-setstate': 'error',
        'react/no-unused-state': 'error',

        // Disabled due to high existing-positive count during initial tslint -> eslint migration
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // v8: ban-types removed, replaced with more specific rules (all off to maintain current behavior)
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        // v8: no-empty-interface replaced with no-empty-object-type (already off above)
        '@typescript-eslint/no-namespace': 'off',
        // v8: no-var-requires replaced with no-require-imports
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/await-thenable': 'off',
        // v8: Temporarily disabled due to potential issues during migration
        '@typescript-eslint/no-duplicate-enum-values': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-direct-mutation-state': 'off',
        'security/detect-object-injection': 'off',
        'no-prototype-builtins': 'off',
    },
    overrides: [
        {
            // Disable type-checked rules for JS files not in tsconfig
            files: ['*.js', '*.mjs', '*.cjs'],
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
        },
        {
            files: ['src/tests/**/*', 'tools/**/*', 'pipeline/**/*', 'deploy/**/*', 'Gruntfile.js'],
            rules: {
                // Disable those errors and warnings which are not a threat to code that is not run in production environments
                'security/detect-non-literal-regexp': 'off',
                'security/detect-non-literal-fs-filename': 'off',
                'security/detect-unsafe-regex': 'off',
                'security/detect-child-process': 'off',
                'security/detect-eval-with-expression': 'off',
            },
        },
    ],
};
