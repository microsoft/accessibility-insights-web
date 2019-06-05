// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceDetailsGroup } from './instance-details-group';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { RuleDetail } from './rule-detail';

export type RuleDetailsGroupProps = {
    rules: RuleResult[];
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
};

export const RuleDetailsGroup = NamedSFC<RuleDetailsGroupProps>('RuleDetailsGroup', ({ rules, showDetails, outcomeType }) => {
    return (
        <div className="rule-details-group">
            {rules.map(rule => (
                <RuleDetail key={rule.id} rule={rule} outcomeType={outcomeType} isHeader={showDetails}>
                    {showDetails ? <InstanceDetailsGroup key={`${rule.id}-rule-group`} nodeResults={rule.nodes} /> : null}
                </RuleDetail>
            ))}
        </div>
    );
});
