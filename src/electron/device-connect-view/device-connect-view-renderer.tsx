// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DeviceConnectViewContainer, DeviceConnectViewContainerProps } from './components/device-connect-view-container';

export class DeviceConnectViewRenderer {
    constructor(
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: ParentNode,
        private readonly props: DeviceConnectViewContainerProps,
    ) {}

    public render(): void {
        const deviceConnectViewContainer = this.dom.querySelector('#device-connect-view-container');
        this.renderer(<DeviceConnectViewContainer {...this.props} />, deviceConnectViewContainer);
    }
}
