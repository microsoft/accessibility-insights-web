// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Theme } from 'common/components/theme';
import { DocumentManipulator } from 'common/document-manipulator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { PlatformBodyClassModifier } from 'electron/views/root-container/components/platform-body-class-modifier';
import { RootContainer } from 'electron/views/root-container/components/root-container';
import {
    RootContainerRenderer,
    RootContainerRendererDeps,
} from 'electron/views/root-container/root-container-renderer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock, Times } from 'typemoq';

describe('RootContainerRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const containerDiv = document.createElement('div');
        const documentManipulatorMock = Mock.ofType<DocumentManipulator>();
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);
        const windowStateActionCreatorMock = Mock.ofType(WindowStateActionCreator);
        const ipcRendererShim: IpcRendererShim = {
            closeWindow: () => {
                return;
            },
        } as IpcRendererShim;

        containerDiv.setAttribute('id', 'root-container');
        dom.appendChild(containerDiv);

        const deps = {
            ipcRendererShim: ipcRendererShim,
            windowStateActionCreator: windowStateActionCreatorMock.object,
            documentManipulator: documentManipulatorMock.object,
        } as unknown as RootContainerRendererDeps;

        const expectedComponent = (
            <>
                <PlatformBodyClassModifier deps={deps} />
                <Theme deps={deps} />
                <RootContainer deps={deps} />
            </>
        );

        renderMock.setup(r => r(It.isValue(expectedComponent), containerDiv)).verifiable();
        windowStateActionCreatorMock
            .setup(w => w.setRoute({ routeId: 'deviceConnectView' }))
            .verifiable(Times.once());

        const renderer = new RootContainerRenderer(renderMock.object, dom, deps);

        renderer.render();

        renderMock.verifyAll();
        windowStateActionCreatorMock.verifyAll();
    });
});
