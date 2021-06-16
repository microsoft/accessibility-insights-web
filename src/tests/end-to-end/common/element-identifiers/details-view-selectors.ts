// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { resultSectionAutomationId } from 'common/components/cards/result-section';
import { ruleDetailsGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { instanceTableTextContentAutomationId } from 'DetailsView/components/assessment-instance-details-column';
import { visualHelperToggleAutomationId } from 'DetailsView/components/base-visual-helper-toggle';
import { settingsPanelAutomationId } from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import { IframeWarningContainerAutomationId } from 'DetailsView/components/iframe-warning';
import { invalidLoadAssessmentDialogOkButtonAutomationId } from 'DetailsView/components/invalid-load-assessment-dialog';
import { loadAssessmentButtonAutomationId } from 'DetailsView/components/load-assessment-button';
import { loadAssessmentDialogLoadButtonAutomationId } from 'DetailsView/components/load-assessment-dialog';
import { overviewContainerAutomationId } from 'DetailsView/components/overview-content/overview-content-container';
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';
import { startOverAutomationId } from 'DetailsView/components/start-over-component-factory';
import { testSummaryStatusAutomationId } from 'reports/components/assessment-summary-details';
import { failureCountAutomationId } from 'reports/components/outcome-chip';
import { outcomeSummaryBarAutomationId } from 'reports/components/outcome-summary-bar';
import {
    cardsRuleIdAutomationId,
    ruleDetailAutomationId,
} from 'reports/components/report-sections/minimal-rule-header';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const detailsViewSelectors = {
    previewFeaturesPanel: '.preview-features-panel',

    testNavLink: (testName: string): string => `div [name="${testName}"]`,
    requirementNavLink: (requirementName: string): string => `div [name="${requirementName}"] a`,
    gettingStartedNavLink: 'div [name="Getting started"]',

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
};

export const navMenuSelectors = {
    commandBarMenuButtonSelectors: {
        collapsed: 'button[aria-label="More items"][aria-expanded=false]',
        expanded: 'button[aria-label="More items"][aria-expanded=true]',
    },

    hamburgerMenuButtonSelectors: {
        collapsed:
            'button[aria-label="Assessment - all tests and requirements list"][aria-expanded=false]',
        // Note: in the expanded state, the hamburger menu opens a modal dialog panel which hides the
        // original menu button, but which has a second identical menu button overlaid. [role="dialog"]
        // causes tests to interact with the dialog's copy (the one on top that the user would see).
        expanded:
            '[role="dialog"] button[aria-label="Assessment - all tests and requirements list"][aria-expanded=true]',
    },
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
    loadAssessmentButton: getAutomationIdSelector(loadAssessmentButtonAutomationId),
    outcomeSummaryBar: getAutomationIdSelector(outcomeSummaryBarAutomationId),
    testOutcomeChips: (testName: string) =>
        getAutomationIdSelector(testSummaryStatusAutomationId(testName)) + ' .outcome-chip',
    loadAssessmentDialogLoadButton: getAutomationIdSelector(
        loadAssessmentDialogLoadButtonAutomationId,
    ),
    invalidLoadAssessmentDialogOkButton: getAutomationIdSelector(
        invalidLoadAssessmentDialogOkButtonAutomationId,
    ),
};

export const settingsPanelSelectors = {
    settingsPanel: getAutomationIdSelector(settingsPanelAutomationId),
    closeButton: 'button[title="Close settings panel"]',
    highContrastModeToggle: 'button#enable-high-contrast-mode',
    telemetryStateToggle: 'button#enable-telemetry',
    enabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="true"]`,
    disabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="false"]`,
};
