// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { AutomatedChecksView } from 'electron/views/automated-checks/components/automated-checks-view';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import * as React from 'react';

export type RootContainerDeps = DeviceConnectViewContainerDeps & {
    storeHub: ClientStoresHub<RootContainerState>;
};

export type RootContainerProps = DeviceConnectViewContainerProps & {
    deps: RootContainerDeps;
};

export type RootContainerState = {
    windowStateStoreData: WindowStateStoreData;
};

export class RootContainer extends React.Component<RootContainerProps, RootContainerState> {
    constructor(props: RootContainerProps) {
        super(props);

        this.state = (props.deps.storeHub as ClientStoresHub<RootContainerState>).getAllStoreData();
    }

    public render(): JSX.Element {
        if (this.state.windowStateStoreData.routeId === 'resultsView') {
            return <AutomatedChecksView {...this.props}></AutomatedChecksView>;
        }
        return <DeviceConnectViewContainer {...this.props}></DeviceConnectViewContainer>;
    }

    public componentDidMount(): void {
        this.props.deps.storeHub.addChangedListenerToAllStores(this.onStoresChange);
    }

    private onStoresChange = () => {
        this.setState(() => (this.props.deps.storeHub as ClientStoresHub<RootContainerState>).getAllStoreData());
    };
}
