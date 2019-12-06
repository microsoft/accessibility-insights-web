// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';

export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',

    testNavLink: (testName: string): string => `nav [name=${testName}] a`,

    mainContent: '[role=main]',
    instanceTableTextContent: '.assessment-instance-textContent',

    gearButton: '.gear-options-icon',
    settingsButton: 'button[name="Settings"]',
};

export const overviewSelectors = {
    overview: '.overview',
    overviewHeading: `[data-automation-id=${overviewHeadingAutomationId}]`,
};

export const settingsPanelSelectors = {
    settingsPanel: '.settings-panel',
    closeButton: 'button[title="Close settings panel"]',
    highContrastModeToggle: 'button#enable-high-contrast-mode',
    telemetryStateToggle: 'button#enable-telemetry',
    enabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="true"]`,
    disabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="false"]`,
};
