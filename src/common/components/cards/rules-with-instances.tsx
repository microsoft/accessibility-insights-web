// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceTagsDeps } from 'common/components/guidance-tags';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';
import { TargetAppData } from '../../../common/types/store-data/unified-data-interface';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { MinimalRuleHeader } from '../../../reports/components/report-sections/minimal-rule-header';
import { CardRuleResult } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import {
    CollapsibleComponentCardsDeps,
    CollapsibleComponentCardsProps,
} from './collapsible-component-cards';
import { RuleContent, RuleContentDeps } from './rule-content';
import styles from './rules-with-instances.scss';

export const ruleGroupAutomationId = 'cards-rule-group';

export type RulesWithInstancesDeps = RuleContentDeps &
    CollapsibleComponentCardsDeps &
    GuidanceTagsDeps & {
        collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
        feedbackURL?: string;
    };

export type RulesWithInstancesProps = {
    deps: RulesWithInstancesDeps;
    rules: CardRuleResult[];
    outcomeType: InstanceOutcomeType;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    targetAppInfo: TargetAppData;
    outcomeCounter: OutcomeCounter;
    headingLevel: number;
    cardSelectionMessageCreator?: CardSelectionMessageCreator;
    narrowModeStatus?: NarrowModeStatus;
};

export const ruleDetailsGroupAutomationId = 'rule-details-group';

export const RulesWithInstances = NamedFC<RulesWithInstancesProps>(
    'RulesWithInstances',
    ({
        rules,
        outcomeType,
        deps,
        userConfigurationStoreData,
        targetAppInfo,
        outcomeCounter,
        headingLevel,
        cardSelectionMessageCreator,
        narrowModeStatus,
    }) => {
        const getCollapsibleComponentProps = (rule: CardRuleResult, idx: number) => {
            const count = outcomeCounter(rule.nodes);
            const outcomeText =
                outcomeType === 'pass'
                    ? 'Passed'
                    : outcomeType === 'fail'
                      ? 'Failed'
                      : outcomeType === 'inapplicable'
                        ? 'Not applicable'
                        : 'Unknown';

            // Include guidance tags in the aria-label for accessibility
            const guidanceTags =
                rule.guidance && deps.getGuidanceTagsFromGuidanceLinks
                    ? deps.getGuidanceTagsFromGuidanceLinks(rule.guidance)
                    : [];
            const guidanceTagsText =
                guidanceTags.length > 0
                    ? `${guidanceTags.map(tag => tag.displayText).join(' ')}`
                    : '';

            // TODO: The aria-label needs to match what screen readers see in the actual button content, but that is currently not well formatted and should be improved in the future
            // Button structure: OutcomeChip (count + hidden full text) + rule.id + ":" + description + guidance
            // There is a redundancy because the OutcomeChip contains both visible count and screen-reader text
            const buttonAriaLabel = `${count} ${outcomeText}${rule.id}: ${rule.description}${guidanceTagsText}`;

            return {
                id: rule.id,
                key: `summary-details-${idx + 1}`,
                header: (
                    <MinimalRuleHeader
                        key={rule.id}
                        deps={deps}
                        rule={rule}
                        outcomeType={outcomeType}
                        outcomeCounter={outcomeCounter}
                    />
                ),
                content: (
                    <RuleContent
                        key={`${rule.id}-rule-group`}
                        deps={deps}
                        rule={rule}
                        outcomeType={outcomeType}
                        userConfigurationStoreData={userConfigurationStoreData}
                        targetAppInfo={targetAppInfo}
                        cardSelectionMessageCreator={cardSelectionMessageCreator}
                        narrowModeStatus={narrowModeStatus}
                        feedbackURL={deps.feedbackURL || undefined}
                    />
                ),
                buttonAriaLabel,
                containerAutomationId: ruleGroupAutomationId,
                containerClassName: styles.collapsibleRuleDetailsGroup,
                headingLevel,
                deps: deps,
                onExpandToggle: (event: React.MouseEvent<HTMLDivElement>) => {
                    cardSelectionMessageCreator?.toggleRuleExpandCollapse(rule.id, event);
                },
                isExpanded: rule.isExpanded,
            };
        };

        return (
            <div
                className={styles.ruleDetailsGroup}
                data-automation-id={ruleDetailsGroupAutomationId}
            >
                {rules.map((rule, idx) => {
                    const CollapsibleComponent = deps.collapsibleControl(
                        getCollapsibleComponentProps(rule, idx),
                    );
                    return CollapsibleComponent;
                })}
            </div>
        );
    },
);
