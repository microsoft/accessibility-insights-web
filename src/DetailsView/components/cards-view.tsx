// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
} from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ScanMetadata } from 'common/types/store-data/scan-meta-data';
import { CardsViewModel } from '../../common/types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';

export type CardsViewDeps = FailedInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <FailedInstancesSection
                deps={props.deps}
                userConfigurationStoreData={props.userConfigurationStoreData}
                scanMetadata={props.scanMetadata}
                shouldAlertFailuresCount={true}
                cardsViewData={props.cardsViewData}
            />
        </>
    );
});
