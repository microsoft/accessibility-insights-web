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
        'scss/comment-no-empty': null, // Disabled to allow for paragraph breaks in longer comments which is not supported yet: https://github.com/stylelint-scss/stylelint-scss/issues/606

        // TO BE ENABLED: Recommended fixes
        'no-descending-specificity': null,

        // TO BE CONFIGURED: Limit shorthand for margin, padding
        // Stretch goal: border-width, border-radius, border-color, border-style, grid-gap
        // Example: 'declaration-property-max-values': { padding: 1 },

        // TO BE CONFIGURED: Enforce variable values
        // Example: 'declaration-property-value-allowed-list': { 'font-weight': ['/^\\$.*$/']},

        // TO BE CONFIGURED: Variable, selector, mixin case
        // https://stylelint.io/user-guide/rules/regex
        'selector-class-pattern': null,

        // Requires investigation
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
    },
};
