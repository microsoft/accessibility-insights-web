// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';
import { ResultSection } from '../../../common/components/cards/result-section';
import {
    CollapsibleResultSection,
    CollapsibleResultSectionDeps,
} from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type PassedChecksSectionDeps = CollapsibleResultSectionDeps;

export type PassedChecksSectionProps = Pick<
    SectionProps,
    | 'deps'
    | 'cardsViewData'
    | 'cardSelectionMessageCreator'
    | 'sectionHeadingLevel'
    | 'expandPassSectionDetails'
    | 'scanMetadata'
> & {
    testKey?: string;
};

export const PassedChecksSection = NamedFC<PassedChecksSectionProps>(
    'PassedChecksSection',
    props => {
        if (props.expandPassSectionDetails?.expandPassSection) {
            if (props.cardsViewData == null || props.cardsViewData.cards == null) {
                return null;
            }

            return (
                <ResultSection
                    deps={props.deps}
                    title="Passed checks"
                    results={props.cardsViewData?.cards?.pass}
                    outcomeType="pass"
                    badgeCount={props.cardsViewData?.cards?.pass?.length}
                    userConfigurationStoreData={null}
                    targetAppInfo={props.scanMetadata.targetAppInfo}
                    visualHelperEnabled={props.cardsViewData?.visualHelperEnabled}
                    allCardsCollapsed={props.cardsViewData?.allCardsCollapsed}
                    outcomeCounter={OutcomeCounter.countByCards}
                    sectionHeadingLevel={props.sectionHeadingLevel}
                    cardSelectionMessageCreator={props.cardSelectionMessageCreator}
                    expandByTags={props.expandPassSectionDetails?.expandByTags}
                />
            );
        } else {
            const cardRuleResults = props.cardsViewData?.cards?.pass ?? [];

            return (
                <CollapsibleResultSection
                    deps={props.deps}
                    title="Passed checks"
                    cardRuleResults={cardRuleResults}
                    containerClassName="result-section"
                    outcomeType="pass"
                    badgeCount={cardRuleResults.length}
                    containerId="passed-checks-section"
                    cardSelectionMessageCreator={props.cardSelectionMessageCreator}
                    testKey={props.testKey}
                    headingLevel={props.sectionHeadingLevel}
                />
            );
        }
    },
);
