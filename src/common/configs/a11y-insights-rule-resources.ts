// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const baseRuleResourcesUrl = 'https://accessibilityinsights.io/info-examples';
const webRuleResourcesPath = `${baseRuleResourcesUrl}/web`;

export const getRuleResourceUrl = (ruleId: string, rulesList: string[], resourcesPath: string) => {
    if (!rulesList.includes(ruleId)) {
        return null;
    }
    return `${resourcesPath}/${ruleId}`;
};

export const getA11yInsightsWebRuleUrl = (ruleId: string) => {
    return getRuleResourceUrl(ruleId, webRulesWithResources, webRuleResourcesPath);
};

const webRulesWithResources = [
    'aria-alt',
    'aria-allowed-attr',
    'aria-conditional-attr',
    'aria-deprecated-role',
    'aria-hidden-body',
    'aria-hidden-focus',
    'aria-input-field-name',
    'aria-prohibited-attr',
    'aria-required-attr',
    'aria-required-attr',
    'aria-required-children',
    'aria-required-parent',
    'aria-roledescription',
    'aria-roles',
    'aria-toggle-field-name',
    'aria-valid-attr',
    'aria-valid-attr-value',
    'autocomplete-valid',
    'avoid-inline-spacing',
    'blink',
    'button-name',
    'bypass',
    'color-contrast',
    'definition-list',
    'dlitem',
    'document-title',
    'duplicate-id',
    'duplicate-id-active',
    'duplicate-id-aria',
    'frame-title',
    'html-has-lang',
    'html-lang-valid',
    'html-xml-lang-mismatch',
    'image-alt',
    'input-button-name',
    'input-image-alt',
    'label',
    'link-name',
    'list',
    'listitem',
    'marquee',
    'meta-refresh',
    'meta-viewport',
    'object-alt',
    'role-img-alt',
    'scrollable-region-focusable',
    'server-side-image-map',
    'td-has-data-cells',
    'td-headers-attr',
    'valid-lang',
];
