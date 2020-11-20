// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { collapsibleButtonAutomationId } from 'common/components/cards/collapsible-component-cards';
import { instanceCardAutomationId } from 'common/components/cards/instance-details';
import { ruleContentAutomationId } from 'common/components/cards/instance-details-group';
import { ruleGroupAutomationId } from 'common/components/cards/rules-with-instances';
import { cardsRuleIdAutomationId } from 'reports/components/report-sections/minimal-rule-header';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

const nthRuleGroup = (n: number) => `${AutomatedChecksViewSelectors.ruleGroup}:nth-of-type(${n})`;

export const AutomatedChecksViewSelectors = {
    ruleGroup: getAutomationIdSelector(ruleGroupAutomationId),
    ruleContent: getAutomationIdSelector(ruleContentAutomationId),

    nthRuleGroupCollapseExpandButton: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(collapsibleButtonAutomationId)}`,
    nthRuleGroupTitle: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(cardsRuleIdAutomationId)}`,
    nthRuleGroupInstances: (position: number) =>
        `${nthRuleGroup(position)} ${getAutomationIdSelector(instanceCardAutomationId)}`,
};
