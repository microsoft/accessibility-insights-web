// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import * as React from 'react';

import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ScanningSpinner } from 'electron/views/automated-checks/components/scanning-spinner';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewDeps = CommandBarDeps &
    TitleBarDeps & {
        scanActionCreator: ScanActionCreator;
        windowStateActionCreator: WindowStateActionCreator;
    };

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
    scanStoreData: ScanStoreData;
    deviceStoreData: DeviceStoreData;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public componentDidMount(): void {
        this.props.deps.scanActionCreator.scan(this.props.deviceStoreData.port);
    }

    public render(): JSX.Element {
        return (
            <>
                <TitleBar deps={this.props.deps}></TitleBar>
                <CommandBar deps={this.props.deps} />
                <HeaderSection />
                {this.renderScanning()}
                {this.renderDeviceDisconnected()}
            </>
        );
    }

    private renderDeviceDisconnected(): JSX.Element {
        if (this.props.scanStoreData.status !== ScanStatus.Failed) {
            return null;
        }

        return (
            <DeviceDisconnectedPopup
                deviceName={this.props.deviceStoreData.connectedDevice}
                onConnectNewDevice={() => this.props.deps.windowStateActionCreator.setRoute({ routeId: 'deviceConnectView' })}
                onRescanDevice={() => this.props.deps.scanActionCreator.scan(this.props.deviceStoreData.port)}
            />
        );
    }

    private renderScanning(): JSX.Element {
        return <ScanningSpinner isScanning={this.props.scanStoreData.status === ScanStatus.Scanning} />;
    }
}
