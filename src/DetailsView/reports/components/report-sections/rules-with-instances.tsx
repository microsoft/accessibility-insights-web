// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { CollapsibleContainer } from './collapsible-container';
import { FullRuleDetail, FullRuleDetailDeps } from './full-rule-detail';
import { InstanceDetailsGroup } from './instance-details-group';

export type RulesWithInstancesDeps = FullRuleDetailDeps;

export type RulesWithInstancesProps = {
    deps: RulesWithInstancesDeps;
    fixInstructionProcessor: FixInstructionProcessor;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesWithInstances = NamedSFC<RulesWithInstancesProps>(
    'RulesWithInstances',
    ({ rules, outcomeType, fixInstructionProcessor, deps }) => {
        return (
            <div className="rule-details-group">
                {rules.map((rule, idx) => {
                    return (
                        <CollapsibleContainer
                            key={`summary-details-${idx + 1}`}
                            id={rule.id}
                            accessibleHeadingContent={
                                <h3 className="screen-reader-only">
                                    rule {rule.id}, {rule.nodes.length} failures
                                </h3>
                            }
                            visibleHeadingContent={<FullRuleDetail deps={deps} key={rule.id} rule={rule} outcomeType={outcomeType} />}
                            collapsibleContent={
                                <InstanceDetailsGroup
                                    fixInstructionProcessor={fixInstructionProcessor}
                                    key={`${rule.id}-rule-group`}
                                    nodeResults={rule.nodes}
                                />
                            }
                            buttonAriaLabel="show failed instance list"
                            containerClassName="collapsible-rule-details-group"
                        />
                    );
                })}
            </div>
        );
    },
);
