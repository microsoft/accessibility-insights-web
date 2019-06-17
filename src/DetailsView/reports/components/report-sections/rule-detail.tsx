// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceListGroupHeader, InstanceListGroupHeaderDeps } from '../instance-list-group-header';
import { InstanceOutcomeType } from './outcome-summary-bar';

export type RuleDetailDeps = InstanceListGroupHeaderDeps;

export type RuleDetailProps = {
    deps: RuleDetailDeps;
    rule: RuleResult;
    outcomeType: InstanceOutcomeType;
    isHeader: boolean;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', props => {
    const { rule, children, outcomeType, isHeader, deps } = props;

    const ariaLabel = isHeader ? 3 : undefined;

    return (
        <>
            <div className="rule-detail">
                <InstanceListGroupHeader deps={deps} ruleResult={rule} outcomeType={outcomeType} ariaLevel={ariaLabel} />
            </div>
            {children}
        </>
    );
});
