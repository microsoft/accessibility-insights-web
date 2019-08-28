// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { outcomeTypeSemantics } from '../../../reports/components/outcome-type';
import { MinimalRuleHeader } from '../../../reports/components/report-sections/minimal-rule-header';
import { CollapsibleComponentCards } from './collapsible-component-cards';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { RuleContentV2, RuleContentV2Deps } from './rule-content-v2';
import { collapsibleRuleDetailsGroup, ruleDetailsGroup } from './rules-with-instances-v2.scss';

export type RulesWithInstancesV2Deps = RuleContentV2Deps;

export type RulesWithInstancesV2Props = {
    deps: RulesWithInstancesV2Deps;
    fixInstructionProcessor: FixInstructionProcessor;
    rules: UnifiedRuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesWithInstancesV2 = NamedSFC<RulesWithInstancesV2Props>(
    'RulesWithInstancesV2',
    ({ rules, outcomeType, fixInstructionProcessor, deps }) => {
        return (
            <div className={ruleDetailsGroup}>
                {rules.map((rule, idx) => {
                    const { pastTense } = outcomeTypeSemantics[outcomeType];
                    const buttonAriaLabel = `${rule.id} ${rule.nodes.length} ${pastTense} ${rule.description}`;
                    return (
                        <CollapsibleComponentCards
                            key={`summary-details-${idx + 1}`}
                            id={rule.id}
                            header={<MinimalRuleHeader key={rule.id} rule={rule} outcomeType={outcomeType} />}
                            content={
                                <RuleContentV2
                                    key={`${rule.id}-rule-group`}
                                    deps={deps}
                                    rule={rule}
                                    fixInstructionProcessor={fixInstructionProcessor}
                                />
                            }
                            containerClassName={css(collapsibleRuleDetailsGroup)}
                            buttonAriaLabel={buttonAriaLabel}
                            titleHeadingLevel={3}
                        />
                    );
                })}
            </div>
        );
    },
);
