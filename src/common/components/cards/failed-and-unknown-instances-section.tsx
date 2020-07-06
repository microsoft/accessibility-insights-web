// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CardsViewModel } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { ResultSection, ResultSectionDeps } from './result-section';

export type FailedAndUnknownInstancesSectionDeps = ResultSectionDeps;
export type FailedAndUnknownInstancesSectionProps = {
    deps: FailedAndUnknownInstancesSectionDeps;
    cardsViewData: CardsViewModel;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    shouldAlertFailuresCount?: boolean;
};

export const FailedAndUnknownInstancesSection = NamedFC<FailedAndUnknownInstancesSectionProps>(
    'FailedAndUnknownInstancesSection',
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

        const count =
            cardsViewData.cards.fail.reduce((total, rule) => {
                return total + rule.nodes.length;
            }, 0) +
            cardsViewData.cards.unknown.reduce((total, rule) => {
                return total + rule.nodes.length;
            }, 0);

        return (
            <ResultSection
                deps={deps}
                title="Instances to review"
                results={[...cardsViewData.cards.fail, ...cardsViewData.cards.unknown]}
                containerClassName={null}
                outcomeType="review"
                badgeCount={count}
                userConfigurationStoreData={userConfigurationStoreData}
                targetAppInfo={scanMetadata.targetAppInfo}
                shouldAlertFailuresCount={shouldAlertFailuresCount}
                visualHelperEnabled={cardsViewData.visualHelperEnabled}
                allCardsCollapsed={cardsViewData.allCardsCollapsed}
            />
        );
    },
);
