// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import {
    CollapsibleResultSection,
    CollapsibleResultSectionDeps,
} from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type IncompleteChecksSectionDeps = CollapsibleResultSectionDeps;

export type IncompleteChecksSectionProps = Pick<
    SectionProps,
    'deps' | 'cardsViewData' | 'cardSelectionMessageCreator' | 'sectionHeadingLevel'
> & {
    testKey?: string;
};

export const IncompleteChecksSection = NamedFC<IncompleteChecksSectionProps>(
    'IncompleteChecksSection',
    ({ deps, cardsViewData, cardSelectionMessageCreator, testKey, sectionHeadingLevel }) => {
        const cardRuleResults = cardsViewData?.cards?.unknown ?? [];

        return (
            <CollapsibleResultSection
                deps={deps}
                title="Incomplete checks"
                cardRuleResults={cardRuleResults}
                containerClassName="result-section"
                outcomeType="incomplete"
                badgeCount={cardRuleResults.length}
                containerId="incomplete-checks-section"
                cardSelectionMessageCreator={cardSelectionMessageCreator}
                testKey={testKey}
                headingLevel={sectionHeadingLevel}
            />
        );
    },
);
