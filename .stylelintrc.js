// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    rules: {
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
        'scss/at-import-partial-extension': 'always',

        // TO BE ENABLED: Recommended fixes
        'scss/at-extend-no-missing-placeholder': null,
        'no-duplicate-selectors': null,
        'no-invalid-position-at-import-rule': null,
        'no-duplicate-at-import-rules': null,
        'scss/no-global-function-names': null,
        'scss/comment-no-empty': null,
        'no-descending-specificity': null,
        'declaration-block-no-redundant-longhand-properties': null,

        // TO BE CONFIGURED: Limit shorthand for margin and padding
        // Example: 'declaration-property-max-values': { padding: 1 },
        'shorthand-property-no-redundant-values': null, // After the limit shorthand for padding and margin is complete, remove this rules and make recommended changes.

        // TO BE CONFIGURED: Enforce variable values
        // Example: 'declaration-property-value-allowed-list': { 'font-weight': ['/^\\$.*$/']},

        // TO BE CONFIGURED: Variable, selector, mixin case
        'selector-class-pattern': null,
        'scss/at-mixin-pattern': null,
        'scss/dollar-variable-pattern': null,

        // Requires investigation
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
    },
};
