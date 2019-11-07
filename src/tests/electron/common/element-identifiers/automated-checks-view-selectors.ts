// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { highlightBoxAutomationId } from 'electron/views/screenshot/highlight-box';
import { screenshotImageAutomationId } from 'electron/views/screenshot/screenshot';
import { screenshotViewAutomationId } from 'electron/views/screenshot/screenshot-view';

export const AutomatedChecksViewSelectors = {
    mainContainer: '.automated-checks-view',
    resultSectionContainer: '.result-section',
    collapsibleRuleDetailsGroup: 'div.collapsible-rule-details-group',
    collapsibleContainerContent: '.collapsible-container-content',
    getRuleDetailsIdSelector: (position: number) =>
        `${AutomatedChecksViewSelectors.collapsibleRuleDetailsGroup}:nth-of-type(${position}) .rule-details-id`,
    getLiFailuresSelector: (position: number) => `${AutomatedChecksViewSelectors.collapsibleRuleDetailsGroup}:nth-of-type(${position}) li`,
    getCollapseExpandButtonByGroupPosition: (position: number) =>
        `${AutomatedChecksViewSelectors.collapsibleRuleDetailsGroup}:nth-of-type(${position}) button`,
};

export const ScreenshotViewSelectors = {
    screenshotView: `[data-automation-id=${screenshotViewAutomationId}]`,
    screenshotImage: `[data-automation-id=${screenshotImageAutomationId}]`,
    highlightBox: `[data-automation-id=${highlightBoxAutomationId}]`,
};
