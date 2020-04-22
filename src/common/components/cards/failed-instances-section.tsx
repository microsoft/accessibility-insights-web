// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ScanMetadata } from 'common/types/store-data/scan-meta-data';
import { CardsViewModel } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { ResultSection, ResultSectionDeps } from './result-section';

export type FailedInstancesSectionDeps = ResultSectionDeps;
export type FailedInstancesSectionProps = {
    deps: FailedInstancesSectionDeps;
    cardsViewData: CardsViewModel;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    shouldAlertFailuresCount?: boolean;
};

export const FailedInstancesSection = NamedFC<FailedInstancesSectionProps>(
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
            />
        );
    },
);
