// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { OutcomeType } from '../outcome-type';
import { InstanceDetailsGroup } from './instance-details-group';
import { RuleDetail } from './rule-detail';

export type RuleDetailsGroupProps = {
    rules: RuleResult[];
    outcomeType: OutcomeType;
    showDetails?: boolean;
};

export const RuleDetailsGroup = NamedSFC<RuleDetailsGroupProps>('RuleDetailsGroup', ({ rules, showDetails, outcomeType }) => {
    return (
        <div className="rule-details-group">
            {rules.map(rule => (
                <>
                    <RuleDetail key={rule.id} rule={rule} outcomeType={outcomeType}>
                        {showDetails ? <InstanceDetailsGroup nodeResults={rule.nodes as any} /> : null}
                    </RuleDetail>
                </>
            ))}
        </div>
    );
});
