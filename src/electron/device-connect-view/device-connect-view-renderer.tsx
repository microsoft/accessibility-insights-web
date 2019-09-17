// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DeviceConnectViewContainer } from './components/device-connect-view-container';

export class DeviceConnectViewRenderer {
    constructor(
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: ParentNode,
        private readonly CurrentWindow: BrowserWindow,
    ) {}

    public render(): void {
        const deviceConnectViewContainer = this.dom.querySelector('#device-connect-view-container');
        const props = {
            deps: {
                currentWindow: this.CurrentWindow,
            },
        };
        this.renderer(<DeviceConnectViewContainer {...props} />, deviceConnectViewContainer);
    }
}
