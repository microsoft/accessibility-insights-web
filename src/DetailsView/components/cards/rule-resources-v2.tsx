// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedRule } from '../../../common/types/store-data/unified-data-interface';
import { moreResourcesTitle, ruleDetailsId, ruleMoreResources } from './rule-resources.scss';

export type RuleResourcesV2Deps = GuidanceTagsDeps;

export type RuleResourcesV2Props = {
    deps: RuleResourcesV2Deps;
    rule: UnifiedRule;
};

export const RuleResourcesV2 = NamedFC<RuleResourcesV2Props>('RuleResourcesV2', ({ deps, rule }) => {
    const renderTitle = () => <div className={moreResourcesTitle}>Resources for this rule</div>;

    const renderRuleLink = () => {
        const ruleId = rule.id;
        const ruleUrl = rule.url;
        return (
            <span className={ruleDetailsId}>
                <NewTabLink href={ruleUrl}>More information about {ruleId}</NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => <GuidanceLinks links={rule.guidance} />;
    const renderGuidanceTags = () => <GuidanceTags deps={deps} links={rule.guidance} />;

    return (
        <div className={ruleMoreResources}>
            {renderTitle()}
            {renderRuleLink()}
            <span>
                {renderGuidanceLinks()}
                {renderGuidanceTags()}
            </span>
        </div>
    );
});
