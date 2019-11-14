// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { FullRuleHeader, FullRuleHeaderDeps } from './full-rule-header';

export type RulesOnlyDeps = FullRuleHeaderDeps;

export type RulesOnlyProps = {
    deps: RulesOnlyDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const RulesOnly = NamedFC<RulesOnlyProps>(
    'RulesOnly',
    ({ rules, outcomeType, deps }) => {
        return (
            <div className="rule-details-group">
                {rules.map(rule => {
                    return (
                        <FullRuleHeader
                            deps={deps}
                            key={rule.id}
                            rule={rule}
                            outcomeType={outcomeType}
                        />
                    );
                })}
            </div>
        );
    },
);
