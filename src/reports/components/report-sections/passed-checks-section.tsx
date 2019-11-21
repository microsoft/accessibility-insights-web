// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CollapsibleResultSection, CollapsibleResultSectionDeps } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type PassedChecksSectionDeps = CollapsibleResultSectionDeps;

export type PassedChecksSectionProps = Pick<SectionProps, 'deps' | 'cardsViewData'>;

export const PassedChecksSection = NamedFC<PassedChecksSectionProps>('PassedChecksSection', ({ deps, cardsViewData }) => {
    const cardResults = cardsViewData.cards.pass;

    return (
        <CollapsibleResultSection
            deps={deps}
            title="Passed checks"
            cardResults={cardResults}
            containerClassName="result-section"
            outcomeType="pass"
            badgeCount={cardResults.length}
            containerId="passed-checks-section"
        />
    );
});
