// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GuidanceLinks } from '../../../common/components/guidance-links';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { NamedSFC } from '../../../common/react/named-sfc';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { OutcomeType } from './outcome-type';
import { OutcomeChip } from './outcome-chip';

export interface InstaceListGroupHeaderProps {
    ruleId: string;
    instanceCount: number;
    ruleDescription: string;
    ruleUrl: string;
    guidanceLinks: HyperlinkDefinition[];
    outcome: OutcomeType;
}

export const InstanceListGroupHeader = NamedSFC<InstaceListGroupHeaderProps>('InstaceListGroupHeader', props => {
    const renderCountBadge = () => {
        const { outcome, instanceCount } = props;

        if (outcome !== 'fail') {
            return null;
        }

        return <OutcomeChip count={instanceCount} outcomeType={outcome} />;
    };

    const renderRuleLink = () => {
        const { ruleId, ruleUrl } = props;
        return (
            <NewTabLink href={ruleUrl} aria-label={`rule ${ruleId}`} aria-describedby={`${ruleId}-rule-description`}>
                {ruleId}
            </NewTabLink>
        );
    };

    const renderGuidanceLiks = () => {
        return <GuidanceLinks links={props.guidanceLinks} />;
    };
    return (
        <div role="heading">
            {renderCountBadge()} {renderRuleLink()}: {props.ruleDescription} ({renderGuidanceLiks()})
        </div>
    );
});
