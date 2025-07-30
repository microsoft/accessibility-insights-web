// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeCounter } from 'reports/components/outcome-counter';

import { CommonInstancesSectionProps } from '../../../common/components/cards/common-instances-section-props';
//import styles from '../../../common/components/cards/failed-instances-section.scss';
import { ResultSection } from '../../../common/components/cards/result-section';

export const PassedChecksSection = NamedFC<CommonInstancesSectionProps>(
    'PassedChecksSection',
    ({
        cardsViewData,
        deps,
        userConfigurationStoreData,
        scanMetadata,
        shouldAlertFailuresCount,
        cardSelectionMessageCreator,
        sectionHeadingLevel,
        narrowModeStatus,
    }) => {
        if (cardsViewData == null || cardsViewData.cards == null) {
            return null;
        }

        return (
            <ResultSection
                deps={deps}
                title="Passed cheks"
                results={cardsViewData.cards.pass}
                outcomeType="pass"
                badgeCount={cardsViewData.cards.pass.length}
                userConfigurationStoreData={userConfigurationStoreData}
                targetAppInfo={scanMetadata.targetAppInfo}
                visualHelperEnabled={cardsViewData.visualHelperEnabled}
                allCardsCollapsed={cardsViewData.allCardsCollapsed}
                outcomeCounter={OutcomeCounter.countByCards}
                sectionHeadingLevel={sectionHeadingLevel}
                cardSelectionMessageCreator={cardSelectionMessageCreator}
            />
        );
    },
);
