// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RuleDetail, RuleDetailDeps } from './rule-detail';

export type RulesDeps = RuleDetailDeps;

export type RulesProps = {
    deps: RulesDeps;
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
};

export const Rules = NamedSFC<RulesProps>('RuleDetailsGroup', ({ rules, outcomeType, deps }) => {
    return (
        <div className="rule-details-group">
            {rules.map(rule => {
                return <RuleDetail deps={deps} key={rule.id} rule={rule} outcomeType={outcomeType} isHeader={false} />;
            })}
        </div>
    );
});
