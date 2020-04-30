// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { WindowFrameListener } from 'electron/window-management/window-frame-listener';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameListener, () => {
    let windowStateActionsCreatorMock: IMock<WindowStateActionCreator>;
    let testSubject: WindowFrameListener;
    let ipcRendererShimMock: IMock<IpcRendererShim>;
    let maximizeEvent;
    let unmaximizeEvent;
    let enterFullScreenEvent;

    beforeEach(() => {
        windowStateActionsCreatorMock = Mock.ofType<WindowStateActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);

        maximizeEvent = new Action<void>();
        unmaximizeEvent = new Action<void>();
        enterFullScreenEvent = new Action<void>();

        testSubject = new WindowFrameListener(
            windowStateActionsCreatorMock.object,
            ipcRendererShimMock.object,
        );
    });

    afterEach(() => {
        windowStateActionsCreatorMock.verifyAll();
        ipcRendererShimMock.verifyAll();
    });

    function setupForListenerInitialization(): void {
        ipcRendererShimMock
            .setup(b => b.fromBrowserWindowMaximize)
            .returns(() => maximizeEvent)
            .verifiable(Times.once());
        ipcRendererShimMock
            .setup(b => b.fromBrowserWindowUnmaximize)
            .returns(() => unmaximizeEvent)
            .verifiable(Times.once());
        ipcRendererShimMock
            .setup(b => b.fromBrowserWindowEnterFullScreen)
            .returns(() => enterFullScreenEvent)
            .verifiable(Times.once());
    }

    it('do nothing on action invocation before initialize', () => {
        maximizeEvent.invoke();
    });

    it('register listeners during initialize', () => {
        setupForListenerInitialization();
        testSubject.initialize();
    });

    describe('validate states in response to events', () => {
        let actualState;

        beforeEach(() => {
            setupForListenerInitialization();
            windowStateActionsCreatorMock
                .setup(x => x.setWindowState(It.isAny()))
                .callback(state => (actualState = state))
                .verifiable(Times.once());
            testSubject.initialize();
        });

        it('set state to maximized on maximize event', () => {
            maximizeEvent.invoke();
            expect(actualState.currentWindowState).toBe('maximized');
        });

        it('set state to customSize on unmaximize event', () => {
            unmaximizeEvent.invoke();
            expect(actualState.currentWindowState).toBe('customSize');
        });

        it('set state to fullscreen on fullscreeen event', () => {
            enterFullScreenEvent.invoke();
            expect(actualState.currentWindowState).toBe('fullScreen');
        });
    });
});
