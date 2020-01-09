// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
} from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CardsViewModel } from '../../common/types/store-data/card-view-model';
import { TargetAppData } from '../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';

export type CardsViewDeps = FailedInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    cardsViewData: CardsViewModel;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <FailedInstancesSection
                deps={props.deps}
                userConfigurationStoreData={props.userConfigurationStoreData}
                targetAppInfo={props.targetAppInfo}
                shouldAlertFailuresCount={true}
                cardsViewData={props.cardsViewData}
            />
        </>
    );
});
