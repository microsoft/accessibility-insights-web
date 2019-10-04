// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';

import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import {
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
    DeviceConnectViewContainerState,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import { ResultsViewContainerDeps, ResultsViewContainerProps } from 'electron/views/results-view/components/results-view-container';

export type RootContainerDeps = DeviceConnectViewContainerDeps &
    ResultsViewContainerDeps & {
        storeHub: ClientStoresHub<RootContainerState>;
    };

export type RootContainerProps = DeviceConnectViewContainerProps &
    ResultsViewContainerProps & {
        deps: RootContainerDeps;
    };

export type RootContainerState = {
    windowStateStoreData: WindowStateStoreData;
} & DeviceConnectViewContainerState;

export class RootContainer extends React.Component<RootContainerProps, RootContainerState> {
    constructor(props: RootContainerProps) {
        super(props);

        this.state = props.deps.storeHub.getAllStoreData();
    }

    public render(): JSX.Element {
        return null;
    }

    public componentDidMount(): void {
        this.props.deps.storeHub.addChangedListenerToAllStores(this.onStoresChange);
    }

    private onStoresChange = () => {
        this.setState(() => this.props.deps.storeHub.getAllStoreData());
    };
}
