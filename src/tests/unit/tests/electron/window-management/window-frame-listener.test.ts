// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SaveWindowBoundsPayload } from 'background/actions/action-payloads';
import { SyncAction } from 'common/flux/sync-action';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { WindowBoundsChangedPayload } from 'electron/flux/action/window-frame-actions-payloads';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { WindowFrameListener } from 'electron/window-management/window-frame-listener';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameListener, () => {
    let windowStateActionsCreatorMock: IMock<WindowStateActionCreator>;
    let testSubject: WindowFrameListener;
    let ipcRendererShimMock: IMock<IpcRendererShim>;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let windowStateStoreMock: IMock<WindowStateStore>;
    let maximizeEvent;
    let unmaximizeEvent;
    let enterFullScreenEvent;
    let windowBoundsChangedEvent;

    beforeEach(() => {
        windowStateActionsCreatorMock = Mock.ofType<WindowStateActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        windowStateStoreMock = Mock.ofType(WindowStateStore);

        maximizeEvent = new SyncAction<void>();
        unmaximizeEvent = new SyncAction<void>();
        enterFullScreenEvent = new SyncAction<void>();
        windowBoundsChangedEvent = new SyncAction<SaveWindowBoundsPayload>();

        testSubject = new WindowFrameListener(
            windowStateActionsCreatorMock.object,
            ipcRendererShimMock.object,
            userConfigMessageCreatorMock.object,
            windowStateStoreMock.object,
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
        ipcRendererShimMock
            .setup(b => b.fromBrowserWindowWindowBoundsChanged)
            .returns(() => windowBoundsChangedEvent)
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

    describe('validate responses to changes to windows bounds', () => {
        const payload: WindowBoundsChangedPayload = {
            windowState: 'normal',
            windowBounds: {
                x: 100,
                y: 200,
                width: 400,
                height: 500,
            },
        };

        beforeEach(() => {
            setupForListenerInitialization();
            testSubject.initialize();
        });

        afterEach(() => {
            windowStateActionsCreatorMock.verifyAll();
            ipcRendererShimMock.verifyAll();
        });

        it('window size is saved when routeId is not deviceConnectView', () => {
            const windowStoreDataStub = {
                routeId: 'resultsView',
            } as WindowStateStoreData;

            const actionPayload: SaveWindowBoundsPayload = payload;

            windowStateStoreMock.setup(w => w.getState()).returns(() => windowStoreDataStub);
            userConfigMessageCreatorMock
                .setup(u => u.saveWindowBounds(actionPayload))
                .verifiable(Times.once());

            windowBoundsChangedEvent.invoke(payload);
        });

        it('window size is not saved when routeId is deviceConnectView', () => {
            const windowStoreDataStub = {
                routeId: 'deviceConnectView',
            } as WindowStateStoreData;

            windowStateStoreMock.setup(w => w.getState()).returns(() => windowStoreDataStub);
            userConfigMessageCreatorMock
                .setup(u => u.saveWindowBounds(It.isAny()))
                .verifiable(Times.never());

            windowBoundsChangedEvent.invoke(payload);
        });
    });
});
