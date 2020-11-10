// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { collapsibleButtonAutomationId } from 'common/components/cards/collapsible-component-cards';
import { instanceCardAutomationId } from 'common/components/cards/instance-details';
import { ruleContentAutomationId } from 'common/components/cards/instance-details-group';
import { ruleGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { leftNavHamburgerButtonAutomationId } from 'common/components/left-nav-hamburger-button';
import { testViewLeftNavLinkAutomationId } from 'DetailsView/components/left-nav/test-view-left-nav-link';
import { exportReportCommandBarButtonId } from 'DetailsView/components/report-export-component';
import { automatedChecksViewAutomationId } from 'electron/views/automated-checks/automated-checks-view';
import { commandButtonSettingsId } from 'electron/views/automated-checks/components/command-bar';
import { fluentLeftNavAutomationId } from 'electron/views/left-nav/fluent-left-nav';
import { leftNavAutomationId } from 'electron/views/left-nav/left-nav';
import { highlightBoxAutomationId } from 'electron/views/screenshot/highlight-box';
import { screenshotImageAutomationId } from 'electron/views/screenshot/screenshot';
import { screenshotViewAutomationId } from 'electron/views/screenshot/screenshot-view';
import { cardsRuleIdAutomationId } from 'reports/components/report-sections/minimal-rule-header';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

const nthRuleGroup = (n: number) => `${AutomatedChecksViewSelectors.ruleGroup}:nth-of-type(${n})`;

export const AutomatedChecksViewSelectors = {
    mainContainer: getAutomationIdSelector(automatedChecksViewAutomationId),
    ruleGroup: getAutomationIdSelector(ruleGroupAutomationId),
    ruleContent: getAutomationIdSelector(ruleContentAutomationId),
    leftNav: getAutomationIdSelector(leftNavAutomationId),
    fluentLeftNav: getAutomationIdSelector(fluentLeftNavAutomationId),
    leftNavHamburgerButton: getAutomationIdSelector(leftNavHamburgerButtonAutomationId),
    exportReportButton: getAutomationIdSelector(exportReportCommandBarButtonId),

    nthRuleGroupCollapseExpandButton: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(collapsibleButtonAutomationId)}`,
    nthRuleGroupTitle: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(cardsRuleIdAutomationId)}`,
    nthRuleGroupInstances: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(instanceCardAutomationId)}`,

    nthTestInLeftNav: (position: number) =>
        `${getAutomationIdSelector(
            leftNavAutomationId,
        )} li:nth-of-type(${position}) ${getAutomationIdSelector(testViewLeftNavLinkAutomationId)}`,

    settingsButton: getAutomationIdSelector(commandButtonSettingsId),
};

export const ScreenshotViewSelectors = {
    screenshotView: getAutomationIdSelector(screenshotViewAutomationId),
    screenshotImage: getAutomationIdSelector(screenshotImageAutomationId),
    highlightBox: getAutomationIdSelector(highlightBoxAutomationId),
    getHighlightBoxByIndex: (index: number) =>
        `${ScreenshotViewSelectors.highlightBox}:nth-of-type(${index})`,
};
