// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { BrowserWindow } from 'electron';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { WindowFrameListener } from 'electron/window-management/window-frame-listener';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameListener, () => {
    let windowStateActionsCreatorMock: IMock<WindowStateActionCreator>;
    let testSubject: WindowFrameListener;
    let browserWindowMock: IMock<BrowserWindow>;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let windowStateStoreMock: IMock<WindowStateStore>;

    beforeEach(() => {
        windowStateActionsCreatorMock = Mock.ofType(WindowStateActionCreator);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        windowStateStoreMock = Mock.ofType(WindowStateStore);

        testSubject = new WindowFrameListener(
            windowStateActionsCreatorMock.object,
            browserWindowMock.object,
            userConfigMessageCreatorMock.object,
            windowStateStoreMock.object,
        );
    });

    afterEach(() => {
        browserWindowMock.verifyAll();
        windowStateActionsCreatorMock.verifyAll();
    });

    it('do nothing on action invocation before initialize', () => {
        browserWindowMock.setup(b => b.on(It.isAny(), It.isAny())).verifiable(Times.never());
    });

    describe('validate window listeners', () => {
        let maximizeCallback: Function;
        let unmaximizeCallback: Function;
        let enterFullScreenCallback: Function;
        let leaveFullScreenCallback: Function;
        let resizeCallback: Function;

        beforeEach(() => {
            setupVerifiableWindowEventCallback('maximize', cb => (maximizeCallback = cb));
            setupVerifiableWindowEventCallback('unmaximize', cb => (unmaximizeCallback = cb));
            setupVerifiableWindowEventCallback(
                'enter-full-screen',
                cb => (enterFullScreenCallback = cb),
            );
            setupVerifiableWindowEventCallback(
                'leave-full-screen',
                cb => (leaveFullScreenCallback = cb),
            );
            setupVerifiableWindowEventCallback('resize', cb => (resizeCallback = cb));

            testSubject.initialize();
        });

        it('validate window state on maximize', () => {
            windowStateActionsCreatorMock
                .setup(b => b.setWindowState({ currentWindowState: 'maximized' }))
                .verifiable(Times.once());

            maximizeCallback();
        });

        it('validate window state on unmaximize', () => {
            windowStateActionsCreatorMock
                .setup(b => b.setWindowState({ currentWindowState: 'customSize' }))
                .verifiable(Times.once());

            unmaximizeCallback();
        });

        it('validate window state on fullscreen', () => {
            windowStateActionsCreatorMock
                .setup(b => b.setWindowState({ currentWindowState: 'fullScreen' }))
                .verifiable(Times.once());

            enterFullScreenCallback();
        });

        it('validate window state on leaving full screen to maximized state', () => {
            browserWindowMock.setup(b => b.isMaximized()).returns(() => true);
            windowStateActionsCreatorMock
                .setup(b => b.setWindowState({ currentWindowState: 'maximized' }))
                .verifiable(Times.once());

            leaveFullScreenCallback();
        });

        it('validate window state on leaving full screen to custom size', () => {
            browserWindowMock.setup(b => b.isMaximized()).returns(() => false);
            windowStateActionsCreatorMock
                .setup(b => b.setWindowState({ currentWindowState: 'customSize' }))
                .verifiable(Times.once());

            leaveFullScreenCallback();
        });

        it('validate window size is saved on resize when routeId is not deviceConnectView', () => {
            const windowStoreDataStub = {
                routeId: 'resultsView',
            } as WindowStateStoreData;

            browserWindowMock.setup(b => b.getSize()).returns(() => [600, 400]);
            windowStateStoreMock.setup(w => w.getState()).returns(() => windowStoreDataStub);
            userConfigMessageCreatorMock
                .setup(u => u.saveLastWindowSize({ width: 600, height: 400 }))
                .verifiable(Times.once());

            resizeCallback();

            userConfigMessageCreatorMock.verifyAll();
        });

        it('validate window size is not saved on resize when routeId is deviceConnectView', () => {
            const windowStoreDataStub = {
                routeId: 'deviceConnectView',
            } as WindowStateStoreData;

            windowStateStoreMock.setup(w => w.getState()).returns(() => windowStoreDataStub);
            userConfigMessageCreatorMock
                .setup(u => u.saveLastWindowSize(It.isAny()))
                .verifiable(Times.never());

            resizeCallback();

            userConfigMessageCreatorMock.verifyAll();
        });

        function setupVerifiableWindowEventCallback(
            eventName: string,
            callback: (eventCallback: Function) => void,
        ): void {
            browserWindowMock
                .setup(b => b.on(eventName as any, It.isAny()))
                .callback((event, cb) => {
                    callback(cb);
                })
                .verifiable(Times.once());
        }
    });
});
