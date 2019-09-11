// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { outcomeTypeSemantics } from '../outcome-type';
import { CollapsibleContainer } from './collapsible-container';
import { MinimalRuleHeader } from './minimal-rule-header';
import { RuleContent, RuleContentDeps } from './rule-content';

export type RulesWithInstancesDeps = RuleContentDeps;

export type RulesWithInstancesProps = {
    deps: RulesWithInstancesDeps;
    fixInstructionProcessor: FixInstructionProcessor;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesWithInstances = NamedFC<RulesWithInstancesProps>(
    'RulesWithInstances',
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
                                <RuleContent
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
