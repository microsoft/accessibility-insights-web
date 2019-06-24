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

export type RuleDetailDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export type RuleDetailProps = {
    deps: RuleDetailDeps;
    rule: RuleResult;
    outcomeType: InstanceOutcomeType;
};

export const RuleDetail = NamedSFC<RuleDetailProps>('RuleDetails', props => {
    const { rule, outcomeType, deps } = props;

    const outcomeText = outcomeTypeSemantics[props.outcomeType].pastTense;
    const ariaDescribedBy = `${kebabCase(outcomeText)}-rule-${rule.id}-description`;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail') {
            return null;
        }

        return <OutcomeChip count={rule.nodes.length} outcomeType={outcomeType} />;
    };

    const renderRuleLink = () => {
        const ruleId = rule.id;
        const ruleUrl = rule.helpUrl;
        return (
            <span className="rule-details-id">
                <NewTabLink href={ruleUrl} aria-label={`rule ${ruleId}`} aria-describedby={ariaDescribedBy}>
                    {ruleId}
                </NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => {
        return <GuidanceLinks links={rule.guidanceLinks} />;
    };

    const renderDescription = () => {
        return (
            <span className="rule-details-description" id={ariaDescribedBy}>
                {rule.description}
            </span>
        );
    };

    const renderGuidanceTags = () => {
        return <GuidanceTags deps={deps} links={rule.guidanceLinks} />;
    };

    return (
        <>
            <div className="rule-detail">
                <div>
                    {renderCountBadge()} {renderRuleLink()}: {renderDescription()} ({renderGuidanceLinks()}) {renderGuidanceTags()}
                </div>
            </div>
        </>
    );
});
