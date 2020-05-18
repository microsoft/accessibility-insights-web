// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { resultSectionAutomationId } from 'common/components/cards/result-section';
import { ruleDetailsGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { assessmentTestTitleAutomationId } from 'DetailsView/components/assessment-view';
import { visualHelperToggleAutomationId } from 'DetailsView/components/base-visual-helper-toggle';
import { settingsPanelAutomationId } from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import { IframeWarningContainerAutomationId } from 'DetailsView/components/iframe-warning';
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';
import { requirementViewTitleAutomationId } from 'DetailsView/components/requirement-view-title';
import { startOverAutomationId } from 'DetailsView/components/start-over-component-factory';
import { failureCountAutomationId } from 'reports/components/outcome-chip';
import {
    cardsRuleIdAutomationId,
    ruleDetailAutomationId,
} from 'reports/components/report-sections/minimal-rule-header';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',
    settingsButton: 'button[name="Settings"]',
    mainContent: '[role=main]',
};

export const assessmentSelectors = {
    testNavLink: (testName: string): string => `nav [name="${testName}"] a`,
    requirementNavLink: (requirementName: string): string => `div [name="${requirementName}"] a`,

    testViewTitle: (testName: string): string =>
        getAutomationIdSelector(assessmentTestTitleAutomationId(testName)),
    requirementViewTitle: (requirementName: string): string =>
        getAutomationIdSelector(requirementViewTitleAutomationId(requirementName)),

    visualHelperToggle: getAutomationIdSelector(visualHelperToggleAutomationId),

    requirementWithStatus: (
        requirementName: string,
        status: 'Passed' | 'Failed' | 'Incomplete',
    ): string => `div[name="${requirementName}"][title^="${requirementName}. ${status}."]`,
};

export const fastPassAutomatedChecksSelectors = {
    startOverButton: getAutomationIdSelector(startOverAutomationId),
    ruleDetailsGroups: getAutomationIdSelector(ruleDetailsGroupAutomationId),
    ruleDetail: getAutomationIdSelector(ruleDetailAutomationId),
    cardsRuleId: getAutomationIdSelector(cardsRuleIdAutomationId),
    failureCount: getAutomationIdSelector(failureCountAutomationId),
    iframeWarning: getAutomationIdSelector(IframeWarningContainerAutomationId),
    automatedChecksResultSection: getAutomationIdSelector(resultSectionAutomationId),
};

export const overviewSelectors = {
    overview: '.overview',
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
