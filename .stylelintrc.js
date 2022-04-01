// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    rules: {
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
        'scss/at-import-partial-extension': 'always',

        // Recommended fixes
        'scss/at-extend-no-missing-placeholder': null,
        'no-duplicate-selectors': null,
        'no-invalid-position-at-import-rule': null,
        'no-duplicate-at-import-rules': null,
        'scss/no-global-function-names': null,
        'scss/comment-no-empty': null,
        'no-descending-specificity': null,
        'declaration-block-no-redundant-longhand-properties': null,

        // Limit shorthand for margin and padding
        // Example: 'declaration-property-max-values': { padding: 1 },
        'shorthand-property-no-redundant-values': null, // Remove and fix this rule after the limit shorthand for padding and margin is complete

        // Enforce variable values
        // Example: 'declaration-property-value-allowed-list': { 'font-weight': ['/^\\$.*$/']},

        // Variable, selector, mixin case
        'selector-class-pattern': null,
        'scss/at-mixin-pattern': null,
        'scss/dollar-variable-pattern': null,

        // Parking lot
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
    },
};
