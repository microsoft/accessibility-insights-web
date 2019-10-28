import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',

    testNavLink: (testName: string): string => `nav [name=${testName}] a`,

    mainContent: '[role=main]',
    instanceTableTextContent: '.assessment-instance-textContent',

    gearButton: '.gear-options-icon',
    settingsButton: 'button[name="Settings"]',
    settingsPanel: '.settings-panel',
    highContrastToggle: 'button#enable-high-contrast-mode',
    highContrastToggleCheckedStateSelector: 'button#enable-high-contrast-mode[aria-checked="true"]',
};

export const overviewSelectors = {
    overview: '.overview',
    overviewHeading: `[data-automation-id=${overviewHeadingAutomationId}]`,
};
