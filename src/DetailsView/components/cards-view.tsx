// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedAndUnknownInstancesSection,
    FailedAndUnknownInstancesSectionDeps,
} from 'common/components/cards/failed-and-unknown-instances-section';
import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
} from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { CardsViewModel } from '../../common/types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';

export type CardsViewDeps = FailedInstancesSectionDeps & FailedAndUnknownInstancesSectionDeps;

export interface CardsViewProps {
    deps: CardsViewDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    selectedTest: VisualizationType;
}

export const CardsView = NamedFC<CardsViewProps>('CardsView', props => {
    if (props.selectedTest === VisualizationType.NeedsReview) {
        return (
            <>
                <FailedAndUnknownInstancesSection
                    deps={props.deps}
                    userConfigurationStoreData={props.userConfigurationStoreData}
                    scanMetadata={props.scanMetadata}
                    shouldAlertFailuresCount={true}
                    cardsViewData={props.cardsViewData}
                />
            </>
        );
    }
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
