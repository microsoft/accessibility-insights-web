// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { RuleResult } from 'scanner/iruleresults';

export type RuleResourcesDeps = GuidanceTagsDeps;

export type RuleResourcesProps = {
    deps: RuleResourcesDeps;
    rule: RuleResult;
};

export const RuleResources = NamedFC<RuleResourcesProps>('RuleResources', ({ deps, rule }) => {
    const renderTitle = () => <div className="more-resources-title">Resources for this rule</div>;

    const renderRuleLink = () => {
        const ruleId = rule.id;
        const ruleUrl = rule.helpUrl;

        return (
            <span className="rule-details-id">
                <NewTabLink href={ruleUrl}>More information about {ruleId}</NewTabLink>
            </span>
        );
    };

    const renderGuidanceLinks = () => <GuidanceLinks links={rule.guidanceLinks} />;
    const renderGuidanceTags = () => <GuidanceTags deps={deps} links={rule.guidanceLinks} />;

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
