// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { outcomeTypeSemantics } from '../../../reports/components/outcome-type';
import { CollapsibleContainer } from '../../../reports/components/report-sections/collapsible-container';
import { MinimalRuleHeader } from '../../../reports/components/report-sections/minimal-rule-header';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { RuleContentDepsV2, RuleContentV2 } from './rule-content-v2';

export type RulesWithInstancesDepsV2 = RuleContentDepsV2;

export type RulesWithInstancesPropsV2 = {
    deps: RulesWithInstancesDepsV2;
    fixInstructionProcessor: FixInstructionProcessor;
    rules: UnifiedRuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesWithInstancesV2 = NamedSFC<RulesWithInstancesPropsV2>(
    'RulesWithInstancesV2',
    ({ rules, outcomeType, fixInstructionProcessor, deps }) => {
        return (
            <div className="rule-details-group">
                {rules.map((rule, idx) => {
                    const { pastTense } = outcomeTypeSemantics[outcomeType];
                    const buttonAriaLabel = `${rule.id} ${rule.nodes.length} ${pastTense} ${rule.description}`;
                    return (
                        <CollapsibleContainer
                            key={`summary-details-${idx + 1}`}
                            id={rule.id}
                            visibleHeadingContent={<MinimalRuleHeader key={rule.id} rule={rule} outcomeType={outcomeType} />}
                            collapsibleContent={
                                <RuleContentV2
                                    key={`${rule.id}-rule-group`}
                                    deps={deps}
                                    rule={rule}
                                    fixInstructionProcessor={fixInstructionProcessor}
                                />
                            }
                            containerClassName="collapsible-rule-details-group"
                            titleHeadingLevel={3}
                            buttonAriaLabel={buttonAriaLabel}
                        />
                    );
                })}
            </div>
        );
    },
);
