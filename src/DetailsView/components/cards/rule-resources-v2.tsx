// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { UnifiedRule } from '../../../common/types/store-data/unified-data-interface';

export type RuleResourcesDepsV2 = GuidanceTagsDeps;

export type RuleResourcesPropsV2 = {
    deps: RuleResourcesDepsV2;
    rule: UnifiedRule;
};

export const RuleResourcesV2 = NamedSFC<RuleResourcesPropsV2>('RuleResourcesV2', ({ deps, rule }) => {
    const renderTitle = () => <div className="more-resources-title">Resources for this rule</div>;

    const renderRuleLink = () => {
        const ruleId = rule.id;
        const ruleUrl = rule.url;

        return (
            <span className="rule-details-id">
                <NewTabLink href={ruleUrl}>More information about {ruleId}</NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => <GuidanceLinks links={rule.guidance} />;
    const renderGuidanceTags = () => <GuidanceTags deps={deps} links={rule.guidance} />;

    return (
        <div className="rule-more-resources">
            {renderTitle()}
            {renderRuleLink()}
            <span>
                {renderGuidanceLinks()}
                {renderGuidanceTags()}
            </span>
        </div>
    );
});
