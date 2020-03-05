// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { collapsibleButtonAutomationId } from 'common/components/cards/collapsible-component-cards';
import { instanceCardAutomationId } from 'common/components/cards/instance-details';
import { ruleContentAutomationId } from 'common/components/cards/instance-details-group';
import { ruleGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { automatedChecksViewAutomationId } from 'electron/views/automated-checks/automated-checks-view';
import { commandButtonSettingsId } from 'electron/views/automated-checks/components/command-bar';
import { highlightBoxAutomationId } from 'electron/views/screenshot/highlight-box';
import { screenshotImageAutomationId } from 'electron/views/screenshot/screenshot';
import { screenshotViewAutomationId } from 'electron/views/screenshot/screenshot-view';
import { cardsRuleIdAutomationId } from 'reports/components/report-sections/minimal-rule-header';

const nthRuleGroup = (n: number) => `${AutomatedChecksViewSelectors.ruleGroup}:nth-of-type(${n})`;

export const AutomatedChecksViewSelectors = {
    mainContainer: `[data-automation-id="${automatedChecksViewAutomationId}"]`,
    ruleGroup: `[data-automation-id="${ruleGroupAutomationId}"]`,
    ruleContent: `[data-automation-id="${ruleContentAutomationId}"]`,

    nthRuleGroupCollapseExpandButton: (position: number) =>
        `${nthRuleGroup(position)} [data-automation-id="${collapsibleButtonAutomationId}"]`,
    nthRuleGroupTitle: (position: number) =>
        `${nthRuleGroup(position)} [data-automation-id="${cardsRuleIdAutomationId}"]`,
    nthRuleGroupInstances: (position: number) =>
        `${nthRuleGroup(position)} [data-automation-id="${instanceCardAutomationId}"]`,

    settingsButton: `[data-automation-id="${commandButtonSettingsId}"]`,
};

export const ScreenshotViewSelectors = {
    screenshotView: `[data-automation-id="${screenshotViewAutomationId}"]`,
    screenshotImage: `[data-automation-id="${screenshotImageAutomationId}"]`,
    highlightBox: `[data-automation-id="${highlightBoxAutomationId}"]`,
    getHighlightBoxByIndex: (index: number) =>
        `${ScreenshotViewSelectors.highlightBox}:nth-of-type(${index})`,
};
