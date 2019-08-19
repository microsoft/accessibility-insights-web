// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';
import { brand } from '../../../../content/strings/application';
import { WindowFooter } from '../../../../electron/device-connect-view/components/window-footer';
import { WindowTitle } from '../../../../electron/device-connect-view/components/window-title';
import { DeviceConnectViewRenderer } from '../../../../electron/device-connect-view/device-connect-view-renderer';
import { BrandBlue } from '../../../../icons/brand/blue/brand-blue';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const deviceConnectViewContainer = document.createElement('div');
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);
        const expectedTitle = brand;

        const browserWindow: BrowserWindow = {
            close: () => {
                return;
            },
        } as BrowserWindow;

        deviceConnectViewContainer.setAttribute('id', 'device-connect-view-container');
        dom.appendChild(deviceConnectViewContainer);

        const expectedComponent = (
            <>
                <WindowTitle title={expectedTitle}>
                    <BrandBlue />
                </WindowTitle>
                <WindowFooter cancelClick={browserWindow.close} canStartTesting={false}></WindowFooter>
            </>
        );

        renderMock.setup(r => r(It.isValue(expectedComponent), deviceConnectViewContainer)).verifiable();

        const renderer = new DeviceConnectViewRenderer(renderMock.object, dom, browserWindow);

        renderer.render();

        renderMock.verifyAll();
    });
});
