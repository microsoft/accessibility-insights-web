// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceListGroupHeader } from '../instance-list-group-header';
import { InstanceOutcomeType } from './outcome-summary-bar';

export type RuleDetailProps = {
    rule: RuleResult;
    outcomeType: InstanceOutcomeType;
    isHeader: boolean;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', ({ rule, children, outcomeType, isHeader }) => {
    const extraProps = {
        role: undefined,
        ariaLevel: undefined,
    };

    if (isHeader) {
        extraProps.role = 'heading';
        extraProps.ariaLevel = '3';
    }
    return (
        <>
            <div className="rule-detail" {...extraProps}>
                <InstanceListGroupHeader ruleResult={rule} outcomeType={outcomeType} />
            </div>
            {children}
        </>
    );
});
