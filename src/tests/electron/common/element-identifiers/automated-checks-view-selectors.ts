// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
