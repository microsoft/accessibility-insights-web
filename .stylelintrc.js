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
        'selector-class-pattern': [
            '^(ms-([A-Z][a-z0-9]*)(-[a-z0-9]+)*)|^(([a-z][a-z0-9]*)(-[a-z0-9]+)*)$',
            {
                message:
                    'Selectors should use `kebab-case`. For FluentUI selectors, use `ms-Upper-kebab-case`.',
            },
        ],
        'declaration-property-max-values': { padding: 1, margin: 1 }, // Limit shorthand to improve readability
        'annotation-no-unknown': null, // Disabled per guidance at https://github.com/stylelint-scss/stylelint-config-recommended-scss/issues/149
        'property-no-vendor-prefix': null, // Disabled, we decided against using a tool like autoprefixer: https://github.com/microsoft/accessibility-insights-web/pull/6278#issuecomment-1372793392
        'value-no-vendor-prefix': null, // Disabled, we decided against using a tool like autoprefixer: https://github.com/microsoft/accessibility-insights-web/pull/6278#issuecomment-1372793392

        // STRETCH GOAL: limit shorthand for border-width, border-radius, border-color, border-style, grid-gap
        // Example: 'declaration-property-max-values': {  'border-width': 1 }

        // TO BE CONFIGURED: Enforce variable values
        // Example: 'declaration-property-value-allowed-list': { 'font-weight': ['/^\\$.*$/']},
    },
};
