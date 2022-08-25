// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

import { CommonInstancesSectionProps } from './common-instances-section-props';
import styles from './failed-instances-section.scss';
import { ResultSection } from './result-section';

export const FailedInstancesSection = NamedFC<CommonInstancesSectionProps>(
    'FailedInstancesSection',
    ({
        cardsViewData,
        deps,
        userConfigurationStoreData,
        scanMetadata,
        shouldAlertFailuresCount,
        cardSelectionMessageCreator,
        sectionHeadingLevel,
        narrowModeStatus,
        cardsViewStoreData,
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
                containerClassName={styles.failedInstancesContainer}
                outcomeType="fail"
                badgeCount={count}
                userConfigurationStoreData={userConfigurationStoreData}
                targetAppInfo={scanMetadata.targetAppInfo}
                shouldAlertFailuresCount={shouldAlertFailuresCount}
                visualHelperEnabled={cardsViewData.visualHelperEnabled}
                allCardsCollapsed={cardsViewData.allCardsCollapsed}
                outcomeCounter={OutcomeCounter.countByCards}
                sectionHeadingLevel={sectionHeadingLevel}
                cardSelectionMessageCreator={cardSelectionMessageCreator}
                narrowModeStatus={narrowModeStatus}
                cardsViewStoreData={cardsViewStoreData}
            />
        );
    },
);
