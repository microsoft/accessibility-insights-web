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

export type DeviceConnectViewContainerDeps = TelemetryPermissionDialogDeps & DeviceConnectBodyDeps;

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    deviceStoreData: DeviceStoreData;
};

export class DeviceConnectViewContainer extends React.Component<DeviceConnectViewContainerProps> {
    public render(): JSX.Element {
        return (
            <>
                <WindowTitle title={brand}>
                    <BrandBlue />
                </WindowTitle>
                <DeviceConnectBody
                    deps={this.props.deps}
                    viewState={{
                        deviceConnectState: this.props.deviceStoreData.deviceConnectState,
                        connectedDevice: this.props.deviceStoreData.connectedDevice,
                    }}
                />
                <TelemetryPermissionDialog deps={this.props.deps} isFirstTime={this.props.userConfigurationStoreData.isFirstTime} />
            </>
        );
    }
}
