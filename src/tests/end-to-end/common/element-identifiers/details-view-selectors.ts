// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',
    previewFeaturesPanelToggleList: '.preview-feature-toggle-list',

    testNavArea: 'nav',
    testNavLink: (testName: string): string => `nav [name=${testName}] a`,

    mainContent: '[role=main]',
    instanceTableTextContent: '.assessment-instance-textContent',

    gearButton: '.gear-options-icon',
    settingsButton: 'button[name="Settings"]',
    settingsPanel: '.settings-panel',
    highContrastToggle: 'button#enable-high-contrast-mode',
};

export const overviewSelectors = {
    overview: '.overview',
    overviewHeading: '.overview-heading',
};
