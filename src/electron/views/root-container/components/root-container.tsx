// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import './root-container.scss';

import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from 'common/components/with-store-subscription';
import { NamedFC } from 'common/react/named-fc';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import {
    AutomatedChecksView,
    AutomatedChecksViewDeps,
    AutomatedChecksViewProps,
} from 'electron/views/automated-checks/automated-checks-view';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import * as React from 'react';
import { LeftNavStoreData } from 'electron/flux/types/left-nav-store-data';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';

export type RootContainerDeps = WithStoreSubscriptionDeps<RootContainerState> &
    DeviceConnectViewContainerDeps &
    AutomatedChecksViewDeps;

export type RootContainerProps = {
    deps: RootContainerDeps;
    storeState: RootContainerState;
};

export type RootContainerState = {
    windowStateStoreData: WindowStateStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanStoreData: ScanStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    androidSetupStoreData: AndroidSetupStoreData;
    leftNavStoreData: LeftNavStoreData;
};

export const RootContainerInternal = NamedFC<RootContainerProps>('RootContainerInternal', props => {
    const { storeState, ...rest } = props;

    const childProps: Omit<AutomatedChecksViewProps, 'narrowModeStatus'> = {
        ...storeState,
        ...rest,
    };

    if (storeState.windowStateStoreData.routeId === 'resultsView') {
        return (
            <NarrowModeDetector
                isNarrowModeEnabled={true}
                Component={AutomatedChecksView}
                childrenProps={childProps}
            />
        );
    }

    return <DeviceConnectViewContainer {...storeState} {...rest} />;
});

export const RootContainer = withStoreSubscription<RootContainerProps, RootContainerState>(
    RootContainerInternal,
);
