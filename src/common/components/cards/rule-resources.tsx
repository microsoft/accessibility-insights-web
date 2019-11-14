// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks } from 'common/components/guidance-links';
import {
    GuidanceTags,
    GuidanceTagsDeps,
} from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { isEmpty } from 'lodash';
import * as React from 'react';

import {
    moreResourcesTitle,
    ruleDetailsId,
    ruleMoreResources,
} from './rule-resources.scss';

export type RuleResourcesDeps = GuidanceTagsDeps;

export type RuleResourcesProps = {
    deps: RuleResourcesDeps;
    rule: UnifiedRule;
};

export const RuleResources = NamedFC<RuleResourcesProps>(
    'RuleResources',
    ({ deps, rule }) => {
        if (rule.url == null && isEmpty(rule.guidance)) {
            return null;
        }

        const renderTitle = () => (
            <div className={moreResourcesTitle}>Resources for this rule</div>
        );

        const renderRuleLink = () => {
            if (rule.url == null) {
                return null;
            }

            const ruleId = rule.id;
            const ruleUrl = rule.url;
            return (
                <span className={ruleDetailsId}>
                    <NewTabLink href={ruleUrl}>
                        More information about {ruleId}
                    </NewTabLink>
                </span>
            );
        };

        const renderGuidanceLinks = () => (
            <GuidanceLinks links={rule.guidance} />
        );
        const renderGuidanceTags = () => (
            <GuidanceTags deps={deps} links={rule.guidance} />
        );

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
    },
);
