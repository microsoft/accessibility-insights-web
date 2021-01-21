// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

import { CommonInstancesSectionProps } from './common-instances-section-props';
import { ResultSection } from './result-section';

export const FailedInstancesSection = NamedFC<CommonInstancesSectionProps>(
    'FailedInstancesSection',
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

        const count = cardsViewData.cards.fail.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        return (
            <ResultSection
                deps={deps}
                title="Failed instances"
                results={cardsViewData.cards.fail}
                containerClassName={null}
                outcomeType="fail"
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
