module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    rules: {
        // For each "null" value in this section, decide to:
        // - enable it by deleting the line and making required fixes
        // - configure it
        // - move to "Ignored" section below
        'scss/at-import-partial-extension': null,
        'declaration-block-no-redundant-longhand-properties': null,
        'scss/at-extend-no-missing-placeholder': null,
        'no-duplicate-selectors': null,
        'no-invalid-position-at-import-rule': null,
        'no-duplicate-at-import-rules': null,
        'scss/no-global-function-names': null,
        'scss/comment-no-empty': null,
        'no-descending-specificity': null,
        'selector-pseudo-class-no-unknown': null,
        'selector-class-pattern': null,
        'scss/at-mixin-pattern': null,
        'scss/dollar-variable-pattern': null,
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,

        // Ignored
        'shorthand-property-no-redundant-values': null, // Can be enabled after the limit shorthand for padding and margin is complete
    },
};
