// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class DeviceConnectViewRenderer {
    constructor(private readonly renderer: typeof ReactDOM.render, private readonly dom: ParentNode) {}

    public render(): void {
        const deviceConnectViewContainer = this.dom.querySelector('#device-connect-view-container');
        this.renderer(
            <>
                <h1>Welcome to Accessibility Insights for Mobile</h1>
            </>,
            deviceConnectViewContainer,
        );
    }
}
