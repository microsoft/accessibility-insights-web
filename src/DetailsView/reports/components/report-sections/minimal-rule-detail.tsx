// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';

export type MinimalRuleDetailProps = {
    rule: RuleResult;
    outcomeType: InstanceOutcomeType;
};

export const MinimalRuleDetail = NamedSFC<MinimalRuleDetailProps>('MinimalRuleDetail', props => {
    const { outcomeType, rule } = props;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail') {
            return null;
        }

        return <OutcomeChip count={rule.nodes.length} outcomeType={outcomeType} />;
    };

    const renderRuleName = () => <span className="rule-details-id">{rule.id}</span>;

    const renderDescription = () => <span className="rule-details-description">{rule.description}</span>;

    return (
        <div className="rule-detail">
            <div>
                {renderCountBadge()} {renderRuleName()}: {renderDescription()}
            </div>
        </div>
    );
});
