// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeaderIcon, HeaderIconDeps } from 'common/components/header-icon';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
} from 'common/components/telemetry-permission-dialog';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { AndroidSetupStepContainer } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-container';
import * as React from 'react';
import { WindowTitle, WindowTitleDeps } from '../../common/window-title/window-title';
import { AndroidSetupPageDeps } from './android-setup/android-setup-types';
import * as styles from './device-connect-view-container.scss';

export type DeviceConnectViewContainerDeps = TelemetryPermissionDialogDeps &
    WindowTitleDeps &
    HeaderIconDeps &
    AndroidSetupPageDeps;

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    windowStateStoreData: WindowStateStoreData;
    androidSetupStoreData: AndroidSetupStoreData;
};

export const DeviceConnectViewContainer = NamedFC<DeviceConnectViewContainerProps>(
    'DeviceConnectViewContainer',
    props => {
        return (
            <div className={styles.windowContainer}>
                <WindowTitle
                    pageTitle={'Connect to your Android device'}
                    deps={props.deps}
                    windowStateStoreData={props.windowStateStoreData}
                >
                    <HeaderIcon invertColors deps={props.deps} />
                </WindowTitle>
                <div className={styles.contentScrollContainer}>
                    <div className={styles.contentContainer}>
                        <AndroidSetupStepContainer {...props} />
                        <TelemetryPermissionDialog
                            deps={props.deps}
                            isFirstTime={props.userConfigurationStoreData.isFirstTime}
                        />
                    </div>
                </div>
            </div>
        );
    },
);
