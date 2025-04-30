// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import security from "eslint-plugin-security";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import parser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig([
        {
        ignores: [
            'node_modules/',
            '**/*bundle.js',
            'dist/',
            'drop/',
            'extension/',
            'packages/',
            'test-results/',
            'src/DetailsView/components/generated-validate-assessment-json.js',
            'replace-plugin.js',
            ],
        },
            
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser,
            parserOptions: {
                project: "./tsconfig.json", 
                tsconfigRootDir: __dirname, 
            },
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            react,
            import: importPlugin,
            security,
            "@typescript-eslint": tseslint,
        },
        rules: {
            eqeqeq: ["error", "always", { null: "ignore" }],

            "import/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],

            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "typemoq",
                            importNames: ["GlobalMock", "GlobalScope"],
                            message:
                                "typemoq Global mocks are incompatible with recent versions of @swc/core, see swc-project/swc#5151",
                        },
                    ],
                },
            ],

            "no-throw-literal": "error",
            "react/no-access-state-in-setstate": "error",
            "react/no-unused-state": "error",
            "react/prop-types": "off",
            "react/display-name": "off",
            "react/no-unescaped-entities": "off",
            "react/no-direct-mutation-state": "off",
            "security/detect-object-injection": "off",
            "no-prototype-builtins": "off",

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-implied-eval": "off",
            "@typescript-eslint/prefer-regexp-exec": "off",
            "@typescript-eslint/await-thenable": "off",
        },
    },
    {
        files: [
            "src/tests/**/*",
            "tools/**/*",
            "pipeline/**/*",
            "deploy/**/*",
            "**/Gruntfile.js",
        ],
        rules: {
            "security/detect-non-literal-regexp": "off",
            "security/detect-non-literal-fs-filename": "off",
            "security/detect-unsafe-regex": "off",
            "security/detect-child-process": "off",
            "security/detect-eval-with-expression": "off",
        },
    },
]);
