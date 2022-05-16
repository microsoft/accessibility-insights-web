// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    rules: {
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
        'scss/at-import-partial-extension': 'always',
        'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates'] }],
        'declaration-block-no-redundant-longhand-properties': null, // Prefer longhand to improve readability
        'shorthand-property-no-redundant-values': null, // Prefer longhand to improve readability

        // TO BE ENABLED: Recommended fixes
        'scss/at-extend-no-missing-placeholder': null,
        'no-duplicate-selectors': null,
        'no-invalid-position-at-import-rule': null,
        'no-duplicate-at-import-rules': null,
        'scss/comment-no-empty': null,
        'no-descending-specificity': null,

        // TO BE CONFIGURED: Limit shorthand for margin, padding
        // Stretch goal: border-width, border-radius, border-color, border-style, grid-gap
        // Example: 'declaration-property-max-values': { padding: 1 },

        // TO BE CONFIGURED: Enforce variable values
        // Example: 'declaration-property-value-allowed-list': { 'font-weight': ['/^\\$.*$/']},

        // TO BE CONFIGURED: Variable, selector, mixin case
        // https://stylelint.io/user-guide/rules/regex
        'selector-class-pattern': null,
        'scss/at-mixin-pattern': null,
        'scss/dollar-variable-pattern': null,

        // Requires investigation
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
    },
};
