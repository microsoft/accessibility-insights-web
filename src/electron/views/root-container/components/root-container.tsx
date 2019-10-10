// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { AutomatedChecksView, AutomatedChecksViewDeps } from 'electron/views/automated-checks/automated-checks-view';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import * as React from 'react';

export type RootContainerDeps = DeviceConnectViewContainerDeps &
    AutomatedChecksViewDeps & {
        storeHub: ClientStoresHub<RootContainerState>;
    };

export type RootContainerProps = {
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
            const devicePort = this.state.deviceStoreData.port;

            return <AutomatedChecksView devicePort={devicePort} {...this.props} />;
        }

        return (
            <DeviceConnectViewContainer
                {...{
                    userConfigurationStoreData: this.state.userConfigurationStoreData,
                    deviceStoreData: this.state.deviceStoreData,
                    ...this.props,
                }}
            />
        );
    }

    public componentDidMount(): void {
        this.props.deps.storeHub.addChangedListenerToAllStores(this.onStoresChange);
    }

    private onStoresChange = () => {
        this.setState(() => this.props.deps.storeHub.getAllStoreData());
    };
}
