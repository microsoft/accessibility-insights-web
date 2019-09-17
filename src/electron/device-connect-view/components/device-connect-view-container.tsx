// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import { brand } from '../../../content/strings/application';
import { BrandBlue } from '../../../icons/brand/blue/brand-blue';
import { DeviceConnectBody } from './device-connect-body';
import { WindowTitle } from './window-title';

export type DeviceConnectViewContainerDeps = {
    currentWindow: BrowserWindow;
};

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
};

export class DeviceConnectViewContainer extends React.Component<DeviceConnectViewContainerProps> {
    public render(): JSX.Element {
        return (
            <>
                <WindowTitle title={brand}>
                    <BrandBlue />
                </WindowTitle>
                <DeviceConnectBody currentWindow={this.props.deps.currentWindow} />
            </>
        );
    }
}
