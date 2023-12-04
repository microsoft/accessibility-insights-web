// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { isEmpty } from 'lodash';
import * as React from 'react';

import styles from './rule-resources.scss';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { getNeedsReviewRuleResourcesUrl, isOutcomeNeedsReview } from '../../configs/needs-review-rule-resources';

export type RuleResourcesDeps = GuidanceTagsDeps & {
    LinkComponent: LinkComponentType;
};

export type RuleResourcesProps = {
    deps: RuleResourcesDeps;
    rule: UnifiedRule;
    outcomeType: InstanceOutcomeType;
};

export const RuleResources = NamedFC<RuleResourcesProps>('RuleResources', ({ deps, rule, outcomeType }) => {
    if (rule.url == null && isEmpty(rule.guidance)) {
        return null;
    }

    const renderTitle = () => (
        <div className={styles.moreResourcesTitle}>Resources for this rule</div>
    );

    const renderRuleLink = () => {
        if (rule.url == null) {
            return null;
        }
        
        const ruleId = rule.id;
        const ruleUrl = isOutcomeNeedsReview(ruleId, outcomeType) ? getNeedsReviewRuleResourcesUrl(ruleId) : rule.url;
        
        return (
            <span className={styles.ruleDetailsId}>
                <deps.LinkComponent href={ruleUrl}>
                    More information about {ruleId}
                </deps.LinkComponent>
            </span>
        );
    };

    const renderGuidanceLinks = () => {
        return <GuidanceLinks links={rule.guidance!} LinkComponent={deps.LinkComponent} />;
    };
    const renderGuidanceTags = () => <GuidanceTags deps={deps} links={rule.guidance!} />;

    return (
        <div className={styles.ruleMoreResources}>
            {renderTitle()}
            {renderRuleLink()}
            <span className={styles.ruleGuidance}>
                {renderGuidanceLinks()}
                {renderGuidanceTags()}
            </span>
        </div>
    );
});
