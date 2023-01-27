// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { collapsibleButtonAutomationId } from 'common/components/cards/collapsible-component-cards';
import { resultSectionAutomationId } from 'common/components/cards/result-section';
import { ruleDetailsGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { recommendationsAutomationId } from 'common/components/fix-instruction-processor';
import { instanceTableTextContentAutomationId } from 'DetailsView/components/assessment-instance-details-column';
import { visualHelperToggleAutomationId } from 'DetailsView/components/base-visual-helper-toggle';
import { settingsPanelAutomationId } from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import { singleExportToHtmlButtonDataAutomationId } from 'DetailsView/components/export-dialog';
import {
    reportExportDropdownAutomationId,
    reportExportDropdownMenuAutomationId,
} from 'DetailsView/components/export-dropdown';
import { IframeWarningContainerAutomationId } from 'DetailsView/components/iframe-warning';
import { inlineStartOverButtonDataAutomationId } from 'DetailsView/components/inline-start-over-button';
import { invalidLoadAssessmentDialogOkButtonAutomationId } from 'DetailsView/components/invalid-load-assessment-dialog';
import { loadAssessmentButtonAutomationId } from 'DetailsView/components/load-assessment-button';
import { loadAssessmentDialogLoadButtonAutomationId } from 'DetailsView/components/load-assessment-dialog';
import { overviewContainerAutomationId } from 'DetailsView/components/overview-content/overview-content-container';
import { overviewHeadingAutomationId } from 'DetailsView/components/overview-content/overview-heading';
import { continueToAssessmentButtonAutomationId } from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { reportExportButtonAutomationId } from 'DetailsView/components/report-export-button';
import { completeButtonAutomationId } from 'DetailsView/components/requirement-view-next-requirement-configuration';
import { startOverAutomationId } from 'DetailsView/components/start-over-component-factory';
import { switcherOptionAutomationId } from 'DetailsView/components/switcher';
import { tabStopsFailedInstanceSectionAutomationId } from 'DetailsView/components/tab-stops-failed-instance-section';
import {
    addFailedInstanceTextAreaAutomationId,
    primaryAddFailedInstanceButtonAutomationId,
} from 'DetailsView/components/tab-stops/failed-instance-panel';
import {
    addTabStopsFailureInstanceAutomationId,
    tabStopsPassFailChoiceGroupAutomationId,
} from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import { transferToAssessmentButtonAutomationId } from 'DetailsView/components/transfer-to-assessment-button';
import { resultsGroupAutomationId } from 'DetailsView/tab-stops-requirements-with-instances';
import { reportExportAsHtmlAutomationId } from 'report-export/services/html-report-export-service';
import { reportExportAsJsonAutomationId } from 'report-export/services/json-report-export-service';
import { testSummaryStatusAutomationId } from 'reports/components/assessment-summary-details';
import { failureCountAutomationId } from 'reports/components/outcome-chip';
import { outcomeSummaryBarAutomationId } from 'reports/components/outcome-summary-bar';
import { reportHeaderSectionDataAutomationId } from 'reports/components/report-sections/header-section';
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
    exportReportButton: getAutomationIdSelector(reportExportButtonAutomationId),
    singleExportToHtmlButton: getAutomationIdSelector(singleExportToHtmlButtonDataAutomationId),
    inlineStartOverButton: getAutomationIdSelector(inlineStartOverButtonDataAutomationId),
    selectedSwitcherOption: (option: string) =>
        `//span[@data-automation-id="${switcherOptionAutomationId}"][text()="${option}"]`,
};

export const navMenuSelectors = {
    commandBarMenuButtonSelectors: {
        collapsed: 'button[aria-label="More actions"][aria-expanded=false]',
        expanded: 'button[aria-label="More actions"][aria-expanded=true]',
    },

    hamburgerMenuButtonSelectors: {
        assessment: {
            collapsed:
                'button[aria-label="Assessment - all tests and requirements list"][aria-expanded=false]',
            // Note: in the expanded state, the hamburger menu opens a modal dialog panel which hides the
            // original menu button, but which has a second identical menu button overlaid. [role="dialog"]
            // causes tests to interact with the dialog's copy (the one on top that the user would see).
            expanded:
                '[role="dialog"] button[aria-label="Assessment - all tests and requirements list"][aria-expanded=true]',
        },
        quickAssess: {
            collapsed:
                'button[aria-label="Quick Assess - all tests and requirements list"][aria-expanded=false]',
            // Note: in the expanded state, the hamburger menu opens a modal dialog panel which hides the
            // original menu button, but which has a second identical menu button overlaid. [role="dialog"]
            // causes tests to interact with the dialog's copy (the one on top that the user would see).
            expanded:
                '[role="dialog"] button[aria-label="Quick Assess - all tests and requirements list"][aria-expanded=true]',
        },
    },
};

export const fastPassAutomatedChecksSelectors = {
    startOverButton: getAutomationIdSelector(startOverAutomationId),
    ruleDetailsGroups: getAutomationIdSelector(ruleDetailsGroupAutomationId),
    ruleDetail: getAutomationIdSelector(ruleDetailAutomationId),
    cardsRuleId: getAutomationIdSelector(cardsRuleIdAutomationId),
    failureCount: getAutomationIdSelector(failureCountAutomationId),
    iframeWarning: getAutomationIdSelector(IframeWarningContainerAutomationId),
    expandButton: getAutomationIdSelector(collapsibleButtonAutomationId),
    recommendationsCard: getAutomationIdSelector(recommendationsAutomationId),
    cardFooterKebabButton: {
        collapsed: 'button[aria-label*="More Actions for failure instance"][aria-expanded=false]',
        expanded: 'button[aria-label*="More Actions for failure instance"][aria-expanded=true]',
    },
};

export const tabStopsSelectors = {
    navDataAutomationId: getAutomationIdSelector('TabStops'),
    addFailureInstanceButton: getAutomationIdSelector(addTabStopsFailureInstanceAutomationId),
    tabStopsPassFailChoiceGroup: getAutomationIdSelector(tabStopsPassFailChoiceGroupAutomationId),
    tabStopsFailRadioButton:
        getAutomationIdSelector(tabStopsPassFailChoiceGroupAutomationId) +
        ' > div > div >div:nth-child(2)',
    addFailedInstanceTextArea: getAutomationIdSelector(addFailedInstanceTextAreaAutomationId),
    primaryAddFailedInstanceButton: getAutomationIdSelector(
        primaryAddFailedInstanceButtonAutomationId,
    ),
    failedInstancesSection: getAutomationIdSelector(tabStopsFailedInstanceSectionAutomationId),
    collapsibleComponentExpandToggleButton: getAutomationIdSelector(collapsibleButtonAutomationId),
    instanceTableTextContent: getAutomationIdSelector(instanceTableTextContentAutomationId),
    instanceEditButton: '[data-automation-key="instanceActionButtons"] button:nth-child(1)',
    instanceRemoveButton: '[data-automation-key="instanceActionButtons"] button:nth-child(2)',
    automatedChecksResultSection: getAutomationIdSelector(resultsGroupAutomationId),
    visualHelperToggleButton: 'button#tab-stops-visual-helper',
    failedInstancesExpandButton: getAutomationIdSelector('collapsible-component-cards-button'),
    failedInstancesContent: getAutomationIdSelector('instance-table-text-content'),
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
    exportReportButton: getAutomationIdSelector(reportExportButtonAutomationId),
    exportDropdown: getAutomationIdSelector(reportExportDropdownAutomationId),
    exportAsJSON: getAutomationIdSelector(reportExportAsJsonAutomationId),
    exportAsHTML: getAutomationIdSelector(reportExportAsHtmlAutomationId),
    exportReportDropdownMenu: `div#${reportExportDropdownMenuAutomationId}`,
};

export const settingsPanelSelectors = {
    settingsPanel: getAutomationIdSelector(settingsPanelAutomationId),
    closeButton: 'button[title="Close settings panel"]',
    highContrastModeToggle: 'button#enable-high-contrast-mode',
    telemetryStateToggle: 'button#enable-telemetry',
    enabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="true"]`,
    disabledToggle: (toggleSelector: string) => `${toggleSelector}[aria-checked="false"]`,
};

export const fastPassReportSelectors = {
    reportHeaderSection: getAutomationIdSelector(reportHeaderSectionDataAutomationId),
};

export const quickAssessSelectors = {
    transferToAssessmentButton: getAutomationIdSelector(transferToAssessmentButtonAutomationId),
    continueToAssessmentDialogButton: getAutomationIdSelector(
        continueToAssessmentButtonAutomationId,
    ),
    completeButton: getAutomationIdSelector(completeButtonAutomationId),
};
