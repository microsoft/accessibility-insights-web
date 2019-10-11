// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { RootContainer, RootContainerProps } from 'electron/views/root-container/components/root-container';
import { RootContainerRenderer } from 'electron/views/root-container/root-container-renderer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock, Times } from 'typemoq';

describe('RootContainerRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const containerDiv = document.createElement('div');
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);
        const windowStateActionCreatorMock = Mock.ofType(WindowStateActionCreator);
        const browserWindow: BrowserWindow = {
            close: () => {
                return;
            },
        } as BrowserWindow;

        containerDiv.setAttribute('id', 'root-container');
        dom.appendChild(containerDiv);

        const props = {
            deps: {
                currentWindow: browserWindow,
            },
        } as RootContainerProps;
        const expectedComponent = <RootContainer {...props} />;

        renderMock.setup(r => r(It.isValue(expectedComponent), containerDiv)).verifiable();
        windowStateActionCreatorMock.setup(w => w.setRoute({ routeId: 'deviceConnectView' })).verifiable(Times.once());

        const renderer = new RootContainerRenderer(renderMock.object, dom, props);

        renderer.render();

        renderMock.verifyAll();
        windowStateActionCreatorMock.verifyAll();
    });
});
