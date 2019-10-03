// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryPermissionDialog, TelemetryPermissionDialogDeps } from 'common/components/telemetry-permission-dialog';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { brand } from 'content/strings/application';
import { BrandBlue } from 'icons/brand/blue/brand-blue';
import * as React from 'react';

import { DeviceStoreData } from '../../../flux/types/device-store-data';
import { DeviceConnectBody, DeviceConnectBodyDeps } from './device-connect-body';
import { WindowTitle } from './window-title';

export type DeviceConnectViewContainerDeps = TelemetryPermissionDialogDeps &
    DeviceConnectBodyDeps & {
        storeHub: ClientStoresHub<DeviceConnectViewContainerState>;
    };

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
};

export type DeviceConnectViewContainerState = {
    userConfigurationStoreData: UserConfigurationStoreData;
    deviceStoreData: DeviceStoreData;
};

export class DeviceConnectViewContainer extends React.Component<DeviceConnectViewContainerProps, DeviceConnectViewContainerState> {
    constructor(props: DeviceConnectViewContainerProps) {
        super(props);
        this.state = props.deps.storeHub.getAllStoreData();
    }

    public render(): JSX.Element {
        return (
            <>
                <WindowTitle title={brand}>
                    <BrandBlue />
                </WindowTitle>
                <DeviceConnectBody
                    deps={this.props.deps}
                    viewState={{
                        deviceConnectState: this.state.deviceStoreData.deviceConnectState,
                        connectedDevice: this.state.deviceStoreData.connectedDevice,
                    }}
                />
                <TelemetryPermissionDialog deps={this.props.deps} isFirstTime={this.state.userConfigurationStoreData.isFirstTime} />
            </>
        );
    }

    public componentDidMount(): void {
        this.props.deps.storeHub.addChangedListenerToAllStores(this.onStoresChange);
    }

    private onStoresChange = () => {
        this.setState(() => this.props.deps.storeHub.getAllStoreData());
    };
}
