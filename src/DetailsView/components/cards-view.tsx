// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection, FailedInstancesSectionDeps, UnifiedStatusResults } from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';

export type CardsViewDeps = FailedInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    ruleResultsByStatus: UnifiedStatusResults;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    return (
        <>
            <FailedInstancesSection
                deps={props.deps}
                ruleResultsByStatus={props.ruleResultsByStatus}
                userConfigurationStoreData={props.userConfigurationStoreData}
            />
        </>
    );
});
