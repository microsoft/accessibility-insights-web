import path from "node:path";
import { fileURLToPath } from "node:url";
import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import react from "eslint-plugin-react";
import security from "eslint-plugin-security";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules/",
        "**/*bundle.js",
        "**/dist/",
        "**/drop/",
        "**/test-results/",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:security/recommended",
), {
    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        security,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 8,
        sourceType: "module",

        parserOptions: {
            project: [`{./tsconfig.json}`],

            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        eqeqeq: ["error", "always", {
            null: "ignore",
        }],

        "import/order": ["error", {
            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],

        "no-restricted-imports": ["error", {
            paths: [{
                name: "typemoq",
                importNames: ["GlobalMock", "GlobalScope"],
                message: "typemoq Global mocks are incompatible with recent versions of @swc/core, see swc-project/swc#5151",
            }],
        }],

        "no-throw-literal": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-unused-state": "error",
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
        "react/prop-types": "off",
        "react/display-name": "off",
        "react/no-unescaped-entities": "off",
        "react/no-direct-mutation-state": "off",
        "security/detect-object-injection": "off",
        "no-prototype-builtins": "off",
    },
}, {
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
}];
