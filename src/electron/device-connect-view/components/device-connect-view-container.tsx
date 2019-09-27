// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { TelemetryPermissionDialog, TelemetryPermissionDialogDeps } from 'common/components/telemetry-permission-dialog';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { brand } from 'content/strings/application';
import { BrandBlue } from 'icons/brand/blue/brand-blue';
import * as React from 'react';

import { DeviceStoreData } from '../../flux/types/device-store-data';
import { DeviceConnectBody, DeviceConnectBodyDeps } from './device-connect-body';
import { WindowTitle } from './window-title';

type DeviceConnectViewContainerStoreDeps = {
    userConfigurationStore: BaseStore<UserConfigurationStoreData>;
    deviceStore: BaseStore<DeviceStoreData>;
};

export type DeviceConnectViewContainerDeps = DeviceConnectViewContainerStoreDeps & TelemetryPermissionDialogDeps & DeviceConnectBodyDeps;

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
        this.state = {
            userConfigurationStoreData: props.deps.userConfigurationStore.getState(),
            deviceStoreData: props.deps.deviceStore.getState(),
        };
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
        this.addChangeListener('deviceStore');
        this.addChangeListener('userConfigurationStore');
    }

    private addChangeListener(storeName: keyof DeviceConnectViewContainerStoreDeps): void {
        this.props.deps[storeName].addChangedListener(() => {
            const dataName = `${storeName}Data` as keyof DeviceConnectViewContainerState;
            const newState = {
                [dataName]: this.props.deps[storeName].getState(),
            } as DeviceConnectViewContainerState;
            this.setState(newState);
        });
    }
}
