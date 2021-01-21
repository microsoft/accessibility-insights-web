// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

import { CommonInstancesSectionProps } from './common-instances-section-props';
import { ResultSection } from './result-section';

export const NeedsReviewInstancesSection = NamedFC<CommonInstancesSectionProps>(
    'NeedsReviewInstancesSection',
    ({
        cardsViewData,
        deps,
        userConfigurationStoreData,
        scanMetadata,
        shouldAlertFailuresCount,
    }) => {
        if (cardsViewData == null || cardsViewData.cards == null) {
            return null;
        }

        const count = cardsViewData.cards.unknown.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        return (
            <ResultSection
                deps={deps}
                title="Instances to review"
                results={cardsViewData.cards.unknown}
                containerClassName={null}
                outcomeType="review"
                badgeCount={count}
                userConfigurationStoreData={userConfigurationStoreData}
                targetAppInfo={scanMetadata.targetAppInfo}
                shouldAlertFailuresCount={shouldAlertFailuresCount}
                visualHelperEnabled={cardsViewData.visualHelperEnabled}
                allCardsCollapsed={cardsViewData.allCardsCollapsed}
                outcomeCounter={OutcomeCounter.countByCards}
                headingLevel={3}
            />
        );
    },
);
