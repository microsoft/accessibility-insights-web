// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceDetailsGroup } from './instance-details-group';
import { RuleDetail } from './rule-detail';

export type RuleDetailsGroupProps = {
    rules: RuleResult[];
    showDetails?: boolean;
};

export const RuleDetailsGroup = NamedSFC<RuleDetailsGroupProps>('RuleDetailsGroup', ({ rules, showDetails }) => {
    return (
        <div className="rule-details-group">
            {rules.map(rule => (
                <>
                    <RuleDetail key={rule.id} rule={rule}>
                        {showDetails ? <InstanceDetailsGroup nodeResults={rule.nodes} /> : null}
                    </RuleDetail>
                </>
            ))}
        </div>
    );
});
