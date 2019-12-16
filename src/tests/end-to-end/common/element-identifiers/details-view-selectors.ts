// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { resultSectionAutomationId } from 'common/components/cards/result-section';
import { ruleDetailsGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';
import { startOverAutomationId } from 'DetailsView/components/start-over-component-factory';
import { failureCountAutomationId } from 'reports/components/outcome-chip';
import { cardsRuleIdAutomationId, ruleDetailAutomationId } from 'reports/components/report-sections/minimal-rule-header';

const getAutomationIdSelector = (id: string) => `[data-automation-id="${id}"]`;

export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',

    testNavLink: (testName: string): string => `nav [name=${testName}] a`,

    mainContent: '[role=main]',
    instanceTableTextContent: '.assessment-instance-textContent',

    gearButton: '.gear-options-icon',
    settingsButton: 'button[name="Settings"]',

    automatedChecksResultSection: getAutomationIdSelector(resultSectionAutomationId),
};

export const fastPassAutomatedChecksSelectors = {
    startOverButton: getAutomationIdSelector(startOverAutomationId),
    ruleDetailsGroups: getAutomationIdSelector(ruleDetailsGroupAutomationId),
    ruleDetail: getAutomationIdSelector(ruleDetailAutomationId),
    cardsRuleId: getAutomationIdSelector(cardsRuleIdAutomationId),
    failureCount: getAutomationIdSelector(failureCountAutomationId),
};

export const overviewSelectors = {
    overview: '.overview',
    overviewHeading: getAutomationIdSelector(overviewHeadingAutomationId),
};

export const settingsPanelSelectors = {
    settingsPanel: '.settings-panel',
    closeButton: 'button[title="Close settings panel"]',
    highContrastModeToggle: 'button#enable-high-contrast-mode',
    telemetryStateToggle: 'button#enable-telemetry',
    enabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="true"]`,
    disabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="false"]`,
};
