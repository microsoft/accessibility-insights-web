import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { StoreNames } from 'common/stores/store-names';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import {
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import { ResultViewContainerDeps, ResultViewContainerProps } from 'electron/views/result-view/components/result-view-container';
import React from 'react';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type RootContainerDeps = DeviceConnectViewContainerDeps &
    ResultViewContainerDeps & {
        storeHub: ClientStoresHub<RootContainerState>;
    };

export type RootContainerProps = DeviceConnectViewContainerProps &
    ResultViewContainerProps & {
        deps: RootContainerDeps;
    };

export type RootContainerState = {
    windowStateStoreData: WindowStateStoreData;
};

export class RootContainer extends React.Component<RootContainerProps, RootContainerState> {
    constructor(props: RootContainerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return();
    }
}
