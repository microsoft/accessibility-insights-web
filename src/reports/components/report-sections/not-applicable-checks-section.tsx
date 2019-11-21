// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { CollapsibleResultSection, CollapsibleResultSectionDeps } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type NotApplicableChecksSectionDeps = CollapsibleResultSectionDeps;

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'deps' | 'cardsViewData'>;

export const NotApplicableChecksSection = NamedFC<NotApplicableChecksSectionProps>(
    'NotApplicableChecksSection',
    ({ deps, cardsViewData }) => {
        const cardResults = cardsViewData.cards.inapplicable;

        return (
            <CollapsibleResultSection
                deps={deps}
                title="Not applicable checks"
                cardResults={cardResults}
                containerClassName="result-section"
                outcomeType="inapplicable"
                badgeCount={cardResults.length}
                containerId="not-applicable-checks-section"
            />
        );
    },
);
