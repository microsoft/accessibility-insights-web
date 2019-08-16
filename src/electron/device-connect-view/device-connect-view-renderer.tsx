// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { brand } from '../../content/strings/application';
import { BrandBlue } from '../../icons/brand/blue/brand-blue';
import { WindowFooter } from './components/window-footer';
import { WindowTitle } from './components/window-title';

export class DeviceConnectViewRenderer {
    constructor(
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: ParentNode,
        private readonly CurrentWindow: BrowserWindow,
    ) {}

    public render(): void {
        const deviceConnectViewContainer = this.dom.querySelector('#device-connect-view-container');
        this.renderer(
            <>
                <WindowTitle title={brand}>
                    <BrandBlue />
                </WindowTitle>
                <WindowFooter cancelClick={this.CurrentWindow.close}></WindowFooter>
            </>,
            deviceConnectViewContainer,
        );
    }
}
