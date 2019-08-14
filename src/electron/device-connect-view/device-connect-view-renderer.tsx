// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrandBlue } from '../../icons/brand/blue/brand-blue';
import { WindowTitle } from './components/window-title';

export class DeviceConnectViewRenderer {
    constructor(private readonly renderer: typeof ReactDOM.render, private readonly dom: ParentNode) {}

    public render(): void {
        const deviceConnectViewContainer = this.dom.querySelector('#device-connect-view-container');
        this.renderer(
            <WindowTitle title="Accessibility Insights">
                <BrandBlue />
            </WindowTitle>,
            deviceConnectViewContainer,
        );
    }
}
