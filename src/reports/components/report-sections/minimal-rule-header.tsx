// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';
import styles from 'reports/components/report-sections/minimal-rule-header.scss';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';

export const cardsRuleIdAutomationId = 'cards-rule-id';
export const ruleDetailAutomationId = 'rule-detail';

export type MinimalRuleHeaderProps = {
    rule: {
        id: string;
        description?: string;
        nodes: any[];
    };
    outcomeType: InstanceOutcomeType;
    outcomeCounter: OutcomeCounter;
};

export const MinimalRuleHeader = NamedFC<MinimalRuleHeaderProps>('MinimalRuleHeader', props => {
    const { outcomeType, rule, outcomeCounter } = props;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail' && outcomeType !== 'review') {
            return null;
        }

        const count = outcomeCounter(rule.nodes);

        return (
            <span aria-hidden="true">
                <OutcomeChip count={count} outcomeType={outcomeType} />
            </span>
        );
    };

    const renderRuleName = () => (
        <span data-automation-id={cardsRuleIdAutomationId} className="rule-details-id">
            <strong>{rule.id}</strong>
        </span>
    );

    const renderDescription = () => (
        <span className="rule-details-description">{rule.description}</span>
    );

    return (
        <span data-automation-id={ruleDetailAutomationId} className="rule-detail">
            <span className={styles.outcomeChipContainer}>{renderCountBadge()}</span>
            <span>
                {renderRuleName()}: {renderDescription()}
            </span>
        </span>
    );
});
