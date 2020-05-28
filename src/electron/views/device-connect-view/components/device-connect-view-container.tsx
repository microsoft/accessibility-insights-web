// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeaderIcon, HeaderIconDeps } from 'common/components/header-icon';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
} from 'common/components/telemetry-permission-dialog';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import * as React from 'react';
import { DeviceStoreData } from '../../../flux/types/device-store-data';
import { WindowTitle, WindowTitleDeps } from '../../common/window-title/window-title';
import { deviceConnectView, mainContentWrapper } from '../device-connect-view.scss';
import { DeviceConnectBody, DeviceConnectBodyDeps } from './device-connect-body';

export type DeviceConnectViewContainerDeps = TelemetryPermissionDialogDeps &
    DeviceConnectBodyDeps &
    WindowTitleDeps &
    HeaderIconDeps;

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    deviceStoreData: DeviceStoreData;
    windowStateStoreData: WindowStateStoreData;
};

export const DeviceConnectViewContainer = NamedFC<DeviceConnectViewContainerProps>(
    'DeviceConnectViewContainer',
    props => {
        return (
            <div className={deviceConnectView}>
                <WindowTitle
                    pageTitle={'Connect to your Android device'}
                    deps={props.deps}
                    windowStateStoreData={props.windowStateStoreData}
                >
                    <HeaderIcon invertColors deps={props.deps} />
                </WindowTitle>
                <div className={mainContentWrapper}>
                    <DeviceConnectBody
                        deps={props.deps}
                        viewState={{
                            deviceConnectState: props.deviceStoreData.deviceConnectState,
                            connectedDevice: props.deviceStoreData.connectedDevice,
                        }}
                    />
                    <TelemetryPermissionDialog
                        deps={props.deps}
                        isFirstTime={props.userConfigurationStoreData.isFirstTime}
                    />
                </div>
            </div>
        );
    },
);
