// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import {
    CollapsibleResultSection,
    CollapsibleResultSectionDeps,
} from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type PassedChecksSectionDeps = CollapsibleResultSectionDeps;

export type PassedChecksSectionProps = Pick<
    SectionProps,
    'deps' | 'cardsViewData' | 'cardSelectionMessageCreator'
>;

export const PassedChecksSection = NamedFC<PassedChecksSectionProps>(
    'PassedChecksSection',
    ({ deps, cardsViewData, cardSelectionMessageCreator }) => {
        const cardRuleResults = cardsViewData.cards.pass;

        return (
            <CollapsibleResultSection
                deps={deps}
                title="Passed checks"
                cardRuleResults={cardRuleResults}
                containerClassName="result-section"
                outcomeType="pass"
                badgeCount={cardRuleResults.length}
                containerId="passed-checks-section"
                cardSelectionMessageCreator={cardSelectionMessageCreator}
            />
        );
    },
);
