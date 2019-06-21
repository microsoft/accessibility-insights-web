// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import * as React from 'react';

import { GuidanceLinks } from '../../../../common/components/guidance-links';
import { GuidanceTags } from '../../../../common/components/guidance-tags';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../../common/get-guidance-tags-from-guidance-links';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';
import { outcomeTypeSemantics } from '../outcome-type';

export type InstanceListGroupHeaderDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export interface InstanceListGroupHeaderProps {
    deps: InstanceListGroupHeaderDeps;
    ruleResult: RuleResult;
    outcomeType: InstanceOutcomeType;
    ariaLevel?: number;
}

export const InstanceListGroupHeader = NamedSFC<InstanceListGroupHeaderProps>('InstaceListGroupHeader', props => {
    const outcomeText = outcomeTypeSemantics[props.outcomeType].pastTense;
    const ariaDescribedBy = `${kebabCase(outcomeText)}-rule-${props.ruleResult.id}-description`;

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
                <NewTabLink href={ruleUrl} aria-label={`rule ${ruleId}`} aria-describedby={ariaDescribedBy}>
                    {ruleId}
                </NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => {
        return <GuidanceLinks links={props.ruleResult.guidanceLinks} />;
    };

    const renderDescription = () => {
        return (
            <span className="rule-details-description" id={ariaDescribedBy}>
                {props.ruleResult.description}
            </span>
        );
    };

    const renderGuidanceTags = () => {
        return <GuidanceTags deps={props.deps} links={props.ruleResult.guidanceLinks} />;
    };

    const headingProps =
        props.ariaLevel != null
            ? {
                  role: 'heading',
                  'aria-level': props.ariaLevel,
              }
            : null;

    return (
        <div {...headingProps}>
            {renderCountBadge()} {renderRuleLink()}: {renderDescription()} ({renderGuidanceLinks()}) {renderGuidanceTags()}
        </div>
    );
});
