// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceListGroupHeader } from '../instance-list-group-header';
import { OutcomeType } from '../outcome-type';

export type RuleDetailProps = {
    rule: RuleResult;
    outcomeType: OutcomeType;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', ({ rule, children, outcomeType }) => {
    return (
        <>
            <div className="rule-detail">
                <InstanceListGroupHeader ruleResult={rule} outcomeType={outcomeType} />
            </div>
            {children}
        </>
    );
});
