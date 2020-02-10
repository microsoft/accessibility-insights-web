// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from 'common/components/with-store-subscription';
import { NamedFC } from 'common/react/named-fc';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import {
    AutomatedChecksView,
    AutomatedChecksViewDeps,
} from 'electron/views/automated-checks/automated-checks-view';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import * as React from 'react';
import './root-container.scss'; // Used for common <body>/etc styles

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
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
};

export const RootContainerInternal = NamedFC<RootContainerProps>('RootContainerInternal', props => {
    const { storeState, ...rest } = props;

    if (storeState.windowStateStoreData.routeId === 'resultsView') {
        return <AutomatedChecksView {...storeState} {...rest} />;
    }

    return <DeviceConnectViewContainer {...storeState} {...rest} />;
});

export const RootContainer = withStoreSubscription<RootContainerProps, RootContainerState>(
    RootContainerInternal,
);
