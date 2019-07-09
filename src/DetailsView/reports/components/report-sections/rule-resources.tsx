// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GuidanceLinks } from '../../../../common/components/guidance-links';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';

export type RuleResourcesProps = {
    rule: RuleResult;
};

export const RuleResources = NamedSFC<RuleResourcesProps>('RuleResources', ({ rule }) => {
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
    return (
        <div className="rule-more-resources">
            <div className="more-resources-title">Resources for this rule</div>
            {renderRuleLink()}
            {renderGuidanceLinks()}
        </div>
    );
});
