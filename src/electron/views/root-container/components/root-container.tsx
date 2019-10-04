// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';

import { TelemetryPermissionDialogDeps } from 'common/components/telemetry-permission-dialog';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { DeviceConnectBodyDeps } from 'electron/views/device-connect-view/components/device-connect-body';
import { DeviceConnectViewContainer } from 'electron/views/device-connect-view/components/device-connect-view-container';
import {
    ResultsViewContainer,
    ResultsViewContainerDeps,
    ResultsViewContainerProps,
} from 'electron/views/results-view/components/results-view-container';

// root container deps should only depend on ResultsViewContainerDeps and DeviceConnectBodyDeps. This will be addresed in a later PR
export type RootContainerDeps = ResultsViewContainerDeps &
    TelemetryPermissionDialogDeps &
    DeviceConnectBodyDeps & {
        storeHub: ClientStoresHub<RootContainerState>;
    };

export type RootContainerProps = ResultsViewContainerProps & {
    deps: RootContainerDeps;
};

export type RootContainerState = {
    windowStateStoreData: WindowStateStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    deviceStoreData: DeviceStoreData;
};

export class RootContainer extends React.Component<RootContainerProps, RootContainerState> {
    constructor(props: RootContainerProps) {
        super(props);

        this.state = props.deps.storeHub.getAllStoreData();
    }

    public render(): JSX.Element {
        if (this.state.windowStateStoreData.routeId === 'resultsView') {
            return <ResultsViewContainer {...this.props}></ResultsViewContainer>;
        }
        return <DeviceConnectViewContainer {...this.props}></DeviceConnectViewContainer>;
    }

    public componentDidMount(): void {
        this.props.deps.storeHub.addChangedListenerToAllStores(this.onStoresChange);
    }

    private onStoresChange = () => {
        this.setState(() => this.props.deps.storeHub.getAllStoreData());
    };
}
