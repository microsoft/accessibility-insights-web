// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags } from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import { isEmpty, kebabCase } from 'lodash';
import * as React from 'react';

import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';
import { outcomeTypeSemantics } from '../outcome-type';

export type FullRuleHeaderDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
    LinkComponent: LinkComponentType;
};

export type FullRuleHeaderProps = {
    deps: FullRuleHeaderDeps;
    cardRuleResult: CardRuleResult;
    outcomeType: InstanceOutcomeType;
};

export const FullRuleHeader = NamedFC<FullRuleHeaderProps>('FullRuleHeader', props => {
    const { outcomeType, deps, cardRuleResult: cardResult } = props;

    const outcomeText = outcomeTypeSemantics[props.outcomeType].pastTense;
    const ariaDescribedBy = `${kebabCase(outcomeText)}-rule-${cardResult.id}-description`;

    const renderCountBadge = () => {
        if (outcomeType !== 'fail') {
            return null;
        }

        return (
            <span aria-hidden="true">
                <OutcomeChip count={cardResult.nodes.length} outcomeType={outcomeType} />
            </span>
        );
    };

    const renderRuleLink = () => {
        const ruleId = cardResult.id;
        const ruleUrl = cardResult.url;
        const displayedRule = ruleUrl ? (
            <NewTabLink
                href={ruleUrl}
                aria-label={`rule ${ruleId}`}
                aria-describedby={ariaDescribedBy}
            >
                {ruleId}
            </NewTabLink>
        ) : (
            <>{ruleId}</>
        );
        return <span className="rule-details-id">{displayedRule}</span>;
    };

    const renderGuidanceLinks = () => {
        // don't display the best practice link since it is included in tags now
        const links = cardResult.guidance?.filter(guidanceLink => !isEmpty(guidanceLink.href)) || [];

        if (isEmpty(links)) {
            return null;
        }
        return (
            <>
                (<GuidanceLinks links={links} LinkComponent={deps.LinkComponent} />)
            </>
        );
    };

    const renderDescription = () => {
        return (
            <span className="rule-details-description" id={ariaDescribedBy}>
                {cardResult.description}
            </span>
        );
    };

    const renderGuidanceTags = () => {
        return <GuidanceTags deps={deps} links={cardResult.guidance} />;
    };

    return (
        <>
            <div className="rule-detail">
                <div>
                    {renderCountBadge()} {renderRuleLink()}: {renderDescription()}
                    {renderGuidanceLinks()}
                    {renderGuidanceTags()}
                </div>
            </div>
        </>
    );
});
