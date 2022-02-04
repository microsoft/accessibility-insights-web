// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CombinedReportResultSectionTitle } from 'common/components/cards/combined-report-result-section-title';
import { ResultSectionDeps } from 'common/components/cards/result-section';
import { ResultSectionContent } from 'common/components/cards/result-section-content';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

export type CombinedReportFailedSectionDeps = ResultSectionDeps;

export type CombinedReportFailedSectionProps = {
    deps: CombinedReportFailedSectionDeps;
    cardsViewData: CardsViewModel;
    scanMetadata: ScanMetadata;
};

export const CombinedReportFailedSection = NamedFC<CombinedReportFailedSectionProps>(
    'CombinedReportFailedSection',
    props => {
        const { deps, cardsViewData, scanMetadata } = props;

        const ruleCount = cardsViewData.cards.fail.length;

        const sectionId = 'combined-report-failed-section';

        const CollapsibleContent = deps.collapsibleControl({
            id: sectionId,
            header: (
                <CombinedReportResultSectionTitle
                    outcomeCount={ruleCount}
                    outcomeType="fail"
                    title="Failed rules"
                />
            ),
            content: (
                <ResultSectionContent
                    deps={deps}
                    outcomeType="fail"
                    targetAppInfo={scanMetadata.targetAppInfo}
                    results={cardsViewData.cards.fail}
                    visualHelperEnabled={cardsViewData.visualHelperEnabled}
                    allCardsCollapsed={cardsViewData.allCardsCollapsed}
                    userConfigurationStoreData={null}
                    outcomeCounter={OutcomeCounter.countByIdentifierUrls}
                    headingLevel={4}
                    cardSelectionMessageCreator={nullCardSelectionMessageCreator}
                />
            ),
            onExpandToggle: null,
            headingLevel: 3,
            deps: null,
        });

        return <div className="result-section">{CollapsibleContent}</div>;
    },
);

const nullCardSelectionMessageCreator: CardSelectionMessageCreator = {
    toggleCardSelection: () => null,
    toggleRuleExpandCollapse: () => null,
    collapseAllRules: () => null,
    expandAllRules: () => null,
    toggleVisualHelper: () => null,
};
