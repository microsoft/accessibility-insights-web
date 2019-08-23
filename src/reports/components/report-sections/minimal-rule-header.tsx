// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from 'common/react/named-sfc';
import { RuleResult } from 'scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';

export type MinimalRuleHeaderProps = {
    rule: {
        id: string;
        description: string;
        nodes: any[];
    };
    outcomeType: InstanceOutcomeType;
};

export const MinimalRuleHeader = NamedSFC<MinimalRuleHeaderProps>('MinimalRuleHeader', props => {
    const { outcomeType, rule } = props;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail') {
            return null;
        }

        return (
            <span aria-hidden="true">
                <OutcomeChip count={rule.nodes.length} outcomeType={outcomeType} />
            </span>
        );
    };

    const renderRuleName = () => <span className="rule-details-id">{rule.id}</span>;

    const renderDescription = () => <span className="rule-details-description">{rule.description}</span>;

    return (
        <span className="rule-detail">
            <span>
                {renderCountBadge()} {renderRuleName()}: {renderDescription()}
            </span>
        </span>
    );
});
