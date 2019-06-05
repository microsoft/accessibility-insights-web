// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GuidanceLinks } from '../../../common/components/guidance-links';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { NamedSFC } from '../../../common/react/named-sfc';
import { RuleResult } from '../../../scanner/iruleresults';
import { OutcomeChip } from './outcome-chip';
import { OutcomeType } from './outcome-type';

export interface InstaceListGroupHeaderProps {
    ruleResult: RuleResult;
    outcomeType: OutcomeType;
}

export const InstanceListGroupHeader = NamedSFC<InstaceListGroupHeaderProps>('InstaceListGroupHeader', props => {
    const renderCountBadge = () => {
        const { outcomeType, ruleResult } = props;

        if (outcomeType !== 'fail') {
            return null;
        }

        return <OutcomeChip count={ruleResult.nodes.length} outcomeType={outcomeType} />;
    };

    const renderRuleLink = () => {
        const ruleResult = props.ruleResult;
        const ruleId = ruleResult.id;
        const ruleUrl = ruleResult.helpUrl;
        return (
            <span className="rule-details-id">
                <NewTabLink href={ruleUrl} aria-label={`rule ${ruleId}`} aria-describedby={`${ruleId}-rule-description`}>
                    {ruleId}
                </NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => {
        return <GuidanceLinks links={props.ruleResult.guidanceLinks} />;
    };

    const renderDescription = () => {
        return <span className="rule-details-description">{props.ruleResult.description}</span>;
    };

    return (
        <div role="heading">
            {renderCountBadge()} {renderRuleLink()}: {renderDescription()} ({renderGuidanceLinks()})
        </div>
    );
});
