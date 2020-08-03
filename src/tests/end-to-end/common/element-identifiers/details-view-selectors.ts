// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { resultSectionAutomationId } from 'common/components/cards/result-section';
import { ruleDetailsGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { instanceTableTextContentAutomationId } from 'DetailsView/components/assessment-instance-details-column';
import { visualHelperToggleAutomationId } from 'DetailsView/components/base-visual-helper-toggle';
import { settingsPanelAutomationId } from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import { IframeWarningContainerAutomationId } from 'DetailsView/components/iframe-warning';
import { overviewContainerAutomationId } from 'DetailsView/components/overview-content/overview-content-container';
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';
import { startOverAutomationId } from 'DetailsView/components/start-over-component-factory';
import { failureCountAutomationId } from 'reports/components/outcome-chip';
import {
    cardsRuleIdAutomationId,
    ruleDetailAutomationId,
} from 'reports/components/report-sections/minimal-rule-header';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',

    testNavLink: (testName: string): string => `div [name="${testName}"]`,
    requirementNavLink: (requirementName: string): string => `div [name="${requirementName}"] a`,
    gettingStartedNavLink: 'div [name="Getting Started"]',

    visualHelperToggle: getAutomationIdSelector(visualHelperToggleAutomationId),

    requirementWithStatus: (
        requirementName: string,
        requirementIndex: string,
        status: 'Passed' | 'Failed' | 'Incomplete',
    ): string =>
        `div[name="${requirementName}"][title^="${requirementIndex}: ${requirementName} (${status})"]`,

    mainContent: '[role=main]',
    instanceTableTextContent: getAutomationIdSelector(instanceTableTextContentAutomationId),

    settingsButton: 'button[name="Settings"]',

    automatedChecksResultSection: getAutomationIdSelector(resultSectionAutomationId),

    commandBarMenuButton: 'button[aria-label="More items"]',
    commandBarMenuButtonExpanded: (expanded: boolean) =>
        `button[aria-label="More items"][aria-expanded=${expanded}`,

    assessmentNavHamburgerButton:
        'button[aria-label="Assessment - all tests and requirements list"]',
    assessmentNavHamburgerButtonExpanded: (expanded: boolean) =>
        `button[aria-label="Assessment - all tests and requirements list"][aria-expanded=${expanded}]`,
};

export const fastPassAutomatedChecksSelectors = {
    startOverButton: getAutomationIdSelector(startOverAutomationId),
    ruleDetailsGroups: getAutomationIdSelector(ruleDetailsGroupAutomationId),
    ruleDetail: getAutomationIdSelector(ruleDetailAutomationId),
    cardsRuleId: getAutomationIdSelector(cardsRuleIdAutomationId),
    failureCount: getAutomationIdSelector(failureCountAutomationId),
    iframeWarning: getAutomationIdSelector(IframeWarningContainerAutomationId),
};

export const overviewSelectors = {
    overview: getAutomationIdSelector(overviewContainerAutomationId),
    overviewHeading: getAutomationIdSelector(overviewHeadingAutomationId),
};

export const settingsPanelSelectors = {
    settingsPanel: getAutomationIdSelector(settingsPanelAutomationId),
    closeButton: 'button[title="Close settings panel"]',
    highContrastModeToggle: 'button#enable-high-contrast-mode',
    telemetryStateToggle: 'button#enable-telemetry',
    enabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="true"]`,
    disabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="false"]`,
};
