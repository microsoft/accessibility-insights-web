// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { outcomeTypeSemantics } from '../../../reports/components/outcome-type';
import { MinimalRuleHeader } from '../../../reports/components/report-sections/minimal-rule-header';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { CollapsibleComponentCardsProps } from './collapsible-component-cards';
import { UnifiedRuleResult } from './failed-instances-section';
import { RuleContent, RuleContentDeps } from './rule-content';
import { collapsibleRuleDetailsGroup, ruleDetailsGroup } from './rules-with-instances.scss';

export type RulesWithInstancesDeps = RuleContentDeps & {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
};

export type RulesWithInstancesProps = {
    deps: RulesWithInstancesDeps;
    fixInstructionProcessor: FixInstructionProcessor;
    rules: UnifiedRuleResult[];
    outcomeType: InstanceOutcomeType;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export const RulesWithInstances = NamedFC<RulesWithInstancesProps>(
    'RulesWithInstances',
    ({ rules, outcomeType, fixInstructionProcessor, deps, userConfigurationStoreData }) => {
        const getCollapsibleComponentProps = (rule: UnifiedRuleResult, idx: number, buttonAriaLabel: string) => {
            return {
                id: rule.id,
                key: `summary-details-${idx + 1}`,
                header: <MinimalRuleHeader key={rule.id} rule={rule} outcomeType={outcomeType} />,
                content: (
                    <RuleContent
                        key={`${rule.id}-rule-group`}
                        deps={deps}
                        rule={rule}
                        fixInstructionProcessor={fixInstructionProcessor}
                        userConfigurationStoreData={userConfigurationStoreData}
                    />
                ),
                containerClassName: css(collapsibleRuleDetailsGroup),
                buttonAriaLabel: buttonAriaLabel,
                headingLevel: 3,
            };
        };

        return (
            <div className={ruleDetailsGroup}>
                {rules.map((rule, idx) => {
                    const { pastTense } = outcomeTypeSemantics[outcomeType];
                    const buttonAriaLabel = `${rule.id} ${rule.nodes.length} ${pastTense} ${rule.description}`;
                    const CollapsibleComponent = deps.collapsibleControl(getCollapsibleComponentProps(rule, idx, buttonAriaLabel));
                    return CollapsibleComponent;
                })}
            </div>
        );
    },
);
