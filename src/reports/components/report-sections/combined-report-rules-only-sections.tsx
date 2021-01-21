// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CombinedReportResultSectionTitle } from 'common/components/cards/combined-report-result-section-title';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { InstanceOutcomeType } from 'reports/components/instance-outcome-type';
import { RulesOnly } from 'reports/components/report-sections/rules-only';
import { CollapsibleResultSectionDeps } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type CombinedReportRulesOnlySectionDeps = CollapsibleResultSectionDeps;

export type CombinedReportRulesOnlySectionProps = Pick<SectionProps, 'deps' | 'cardsViewData'>;

const makeCombinedReportRulesOnlySection = (options: {
    outcomeType: InstanceOutcomeType;
    title: string;
}) =>
    NamedFC<CombinedReportRulesOnlySectionProps>(
        'CombinedReportRulesOnlySection',
        ({ deps, cardsViewData }) => {
            const { outcomeType, title } = options;
            const cardRuleResults = cardsViewData.cards[outcomeType];

            const CollapsibleContent = deps.collapsibleControl({
                id: `${outcomeType}-checks-section`,
                header: (
                    <CombinedReportResultSectionTitle
                        outcomeCount={cardRuleResults.length}
                        outcomeType={outcomeType}
                        title={title}
                        titleSize="title"
                    />
                ),
                content: (
                    <RulesOnly
                        deps={deps}
                        cardRuleResults={cardRuleResults}
                        outcomeType={outcomeType}
                    />
                ),
                headingLevel: 3,
                deps: null,
            });

            return <div className="result-section">{CollapsibleContent}</div>;
        },
    );

export const CombinedReportPassedSection = makeCombinedReportRulesOnlySection({
    outcomeType: 'pass',
    title: 'Passed rules',
});

export const CombinedReportNotApplicableSection = makeCombinedReportRulesOnlySection({
    outcomeType: 'inapplicable',
    title: 'Not applicable rules',
});
