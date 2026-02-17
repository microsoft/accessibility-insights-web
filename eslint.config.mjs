// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import security from 'eslint-plugin-security';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
    {
        ignores: [
            'node_modules/',
            '**/*bundle.js',
            'dist/',
            'drop/',
            'extension/',
            'test-results/',
            'src/DetailsView/components/generated-validate-assessment-json.js',
            'replace-plugin.js',
        ],
    },

    js.configs.recommended,

    {
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2017,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            react,
            security,
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            // --- Core rules ---
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: true,
                    allowSeparatedGroups: true,
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

            // --- React rules ---
            ...react.configs.recommended.rules,
            'react/no-access-state-in-setstate': 'error',
            'react/no-unused-state': 'error',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            'react/no-direct-mutation-state': 'off',

            // --- Security rules ---
            ...security.configs.recommended.rules,
            'security/detect-object-injection': 'off',

            // --- TypeScript rules ---
            // Spread recommended configs
            ...tseslint.configs.recommended.reduce((acc, cfg) => ({ ...acc, ...cfg.rules }), {}),
            ...tseslint.configs.recommendedTypeChecked.reduce(
                (acc, cfg) => ({ ...acc, ...cfg.rules }),
                {},
            ),

            // Disabled due to high existing-positive count during initial tslint -> eslint migration
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-restricted-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-namespace': 'off',
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

            // New in typescript-eslint v8 presets — disabled for behavioral parity with v5
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
            '@typescript-eslint/no-duplicate-type-constituents': 'off',
            '@typescript-eslint/only-throw-error': 'off',

            // --- Other ---
            'no-prototype-builtins': 'off',
        },
    },

    // Relaxed security rules for test/tool files
    {
        files: ['src/tests/**/*', 'tools/**/*', 'pipeline/**/*', 'deploy/**/*', '**/Gruntfile.js'],
        rules: {
            'security/detect-non-literal-regexp': 'off',
            'security/detect-non-literal-fs-filename': 'off',
            'security/detect-unsafe-regex': 'off',
            'security/detect-child-process': 'off',
            'security/detect-eval-with-expression': 'off',
        },
    },

    // JS files are not included in tsconfig.json, so disable type-checked parsing
    {
        files: ['**/*.js'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
        rules: {
            // Turn off rules that require type information
            ...Object.fromEntries(
                Object.entries(
                    tseslint.configs.recommendedTypeChecked.reduce(
                        (acc, cfg) => ({ ...acc, ...cfg.rules }),
                        {},
                    ),
                ).map(([key]) => [key, 'off']),
            ),
        },
    },

    // Package-level override for report-e2e-tests
    {
        files: ['packages/report-e2e-tests/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './packages/report-e2e-tests/tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
);
