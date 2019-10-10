// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection, FailedInstancesSectionDeps, UnifiedStatusResults } from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import * as React from 'react';

import { TargetAppData } from '../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';

export type CardsViewDeps = FailedInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    ruleResultsByStatus: UnifiedStatusResults;
    userConfigurationStoreData: UserConfigurationStoreData;
    targetAppInfo: TargetAppData;
    cardSelectionStoreData: CardSelectionStoreData;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    console.log('CARDS VIEW', props);
    return (
        <>
            <FailedInstancesSection
                deps={props.deps}
                ruleResultsByStatus={props.ruleResultsByStatus}
                userConfigurationStoreData={props.userConfigurationStoreData}
                targetAppInfo={props.targetAppInfo}
            />
        </>
    );
});
