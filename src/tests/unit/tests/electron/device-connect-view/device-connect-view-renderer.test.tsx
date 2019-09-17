// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { DeviceConnectViewRenderer } from 'electron/device-connect-view/device-connect-view-renderer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';
import { DeviceConnectViewContainer } from '../../../../../electron/device-connect-view/components/device-connect-view-container';

describe('DeviceConnectViewRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const containerDiv = document.createElement('div');
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);

        const browserWindow: BrowserWindow = {
            close: () => {
                return;
            },
        } as BrowserWindow;

        containerDiv.setAttribute('id', 'device-connect-view-container');
        dom.appendChild(containerDiv);

        const expectedProps = {
            deps: {
                currentWindow: browserWindow,
            },
        };

        const expectedComponent = <DeviceConnectViewContainer {...expectedProps} />;

        renderMock.setup(r => r(It.isValue(expectedComponent), containerDiv)).verifiable();

        const renderer = new DeviceConnectViewRenderer(renderMock.object, dom, browserWindow);

        renderer.render();

        renderMock.verifyAll();
    });
});
