// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleResourcesDeps } from 'common/components/cards/rule-resources';
import { GuidanceTags } from 'common/components/guidance-tags';
import { NamedFC } from 'common/react/named-fc';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';
import styles from 'reports/components/report-sections/minimal-rule-header.scss';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';

export const cardsRuleIdAutomationId = 'cards-rule-id';
export const ruleDetailAutomationId = 'rule-detail';

export type MinimalRuleHeaderProps = {
    deps: RuleResourcesDeps;
    rule: {
        id: string;
        description?: string;
        nodes: any[];
        guidance?: GuidanceLink[];
    };
    outcomeType: InstanceOutcomeType;
    outcomeCounter: OutcomeCounter;
};

export const MinimalRuleHeader = NamedFC<MinimalRuleHeaderProps>('MinimalRuleHeader', props => {
    const { outcomeType, rule, outcomeCounter, deps } = props;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail' && outcomeType !== 'review') {
            return null;
        }

        const count = outcomeCounter(rule.nodes);

        return (
            <span aria-hidden="true">
                <OutcomeChip count={count} outcomeType={outcomeType} labelledBy={true} />
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

    const renderGuidanceTags = () => {
        if (!rule.guidance) {
            return null;
        }
        return <GuidanceTags deps={deps} links={rule.guidance} />;
    };

    return (
        <span data-automation-id={ruleDetailAutomationId} className="rule-detail">
            {outcomeType !== 'pass' && (
                <span className={styles.outcomeChipContainer}>{renderCountBadge()}</span>
            )}
            <span>
                {renderRuleName()}: {renderDescription()}
                {rule.guidance && ' '}
                {renderGuidanceTags()}
            </span>
        </span>
    );
});
