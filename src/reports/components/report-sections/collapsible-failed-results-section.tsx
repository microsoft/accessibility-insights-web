// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ResultSectionDeps } from 'common/components/cards/result-section';
import { ResultSectionContent } from 'common/components/cards/result-section-content';
import { ResultSectionTitle } from 'common/components/cards/result-section-title';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { OutcomeCounter } from 'reports/components/outcome-counter';

export type CollapsibleFailedResultsSectionDeps = ResultSectionDeps;

export type CollapsibleFailedResultsSectionProps = {
    deps: CollapsibleFailedResultsSectionDeps;
    cardsByRule: CardsViewModel;
    scanMetadata: ScanMetadata;
};

export const CollapsibleFailedResultsSection = NamedFC<CollapsibleFailedResultsSectionProps>(
    'CollapsibleFailedResultsSection',
    props => {
        const { deps, cardsByRule, scanMetadata } = props;

        const count = cardsByRule.cards.fail.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        const CollapsibleContent = deps.collapsibleControl({
            header: (
                <ResultSectionTitle
                    badgeCount={count}
                    outcomeType="fail"
                    title="Failed"
                    titleSize="title"
                    {...props}
                />
            ),
            content: (
                <ResultSectionContent
                    outcomeType="fail"
                    targetAppInfo={scanMetadata.targetAppInfo}
                    results={cardsByRule.cards.fail}
                    visualHelperEnabled={cardsByRule.visualHelperEnabled}
                    allCardsCollapsed={cardsByRule.allCardsCollapsed}
                    userConfigurationStoreData={null}
                    outcomeCounter={OutcomeCounter.countByIdentifierUrls}
                    {...props}
                />
            ),
            headingLevel: 2,
            deps: null,
        });

        return <div className="result-section">{CollapsibleContent}</div>;
    },
);
