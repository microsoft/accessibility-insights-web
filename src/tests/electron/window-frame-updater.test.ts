// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowFrameUpdater } from 'electron/window-frame-updater';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { WindowStateStore } from '../../electron/flux/store/window-state-store';
import { ViewRoutes, WindowStateStoreData } from '../../electron/flux/types/window-state-store-data';

describe(WindowFrameUpdater, () => {
    let windowStateStoreMock: IMock<WindowStateStore>;
    let testSubject: WindowFrameUpdater;
    let browserWindowMock: IMock<BrowserWindow>;
    let changeListener: () => void;
    let windowStoreStateData: WindowStateStoreData;

    beforeEach(() => {
        windowStateStoreMock = Mock.ofType(WindowStateStore);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);
        windowStoreStateData = {
            currentWindowState: undefined,
            routeId: 'deviceConnectView',
        };

        windowStateStoreMock
            .setup(w => w.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListener = cb;
            });

        windowStateStoreMock.setup(w => w.getState()).returns(() => windowStoreStateData);

        testSubject = new WindowFrameUpdater(windowStateStoreMock.object, browserWindowMock.object);
    });

    describe('initialize', () => {
        it('updates window based on initial state - deviceConnectView', () => {
            setupVerifiableCallsForDeviceConnectRoute();
            windowStoreStateData.routeId = 'deviceConnectView';

            testSubject.initialize();

            windowStateStoreMock.verifyAll();
            browserWindowMock.verifyAll();
        });

        it('updates window based on initial state - resultsView', () => {
            windowStoreStateData = {
                currentWindowState: 'restoredOrMaximized',
                routeId: 'resultsView',
            };
            setupVerifiableMaximizeWindowCall();

            testSubject.initialize();

            windowStateStoreMock.verifyAll();
            browserWindowMock.verifyAll();
        });
    });

    describe('verify change listener', () => {
        beforeEach(() => {
            windowStoreStateData = {
                routeId: 'deviceConnectView',
                currentWindowState: 'restoredOrMaximized',
            };

            setupVerifiableCallsForDeviceConnectRoute();

            testSubject.initialize();
            browserWindowMock.reset();
        });

        it('sets window state to deviceConnectView', () => {
            setupVerifiableCallsForDeviceConnectRoute();

            changeListener();

            browserWindowMock.verifyAll();
        });

        it('sets window state to results view', () => {
            windowStoreStateData = {
                routeId: 'resultsView',
                currentWindowState: 'restoredOrMaximized',
            };

            setupVerifiableMaximizeWindowCall();
            changeListener();

            browserWindowMock.verifyAll();
        });

        it('minimizes the window under results view', () => {
            windowStoreStateData.routeId = 'resultsView';
            windowStoreStateData.currentWindowState = 'minimized';

            setupVerifiableMinimizeWindowCall();

            changeListener();

            browserWindowMock.verifyAll();
        });

        it('restores the window under results view', () => {
            windowStoreStateData.routeId = 'resultsView';
            windowStoreStateData.currentWindowState = 'restoredOrMaximized';

            setupVerifiableRestoreWindowCall();

            changeListener();

            browserWindowMock.verifyAll();
        });
    });

    function setupVerifiableCallsForDeviceConnectRoute(): void {
        browserWindowMock.setup(b => b.setSize(600, 391)).verifiable(Times.once());
        browserWindowMock.setup(b => b.center()).verifiable(Times.once());
    }

    function setupVerifiableMaximizeWindowCall(): void {
        browserWindowMock
            .setup(b => b.isMaximized())
            .returns(() => false)
            .verifiable(Times.once());
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());
    }

    function setupVerifiableRestoreWindowCall(): void {
        browserWindowMock
            .setup(b => b.isMaximized())
            .returns(() => true)
            .verifiable(Times.once());
        browserWindowMock.setup(b => b.restore()).verifiable(Times.once());
    }

    function setupVerifiableMinimizeWindowCall(): void {
        browserWindowMock
            .setup(b => b.isMinimized())
            .returns(() => false)
            .verifiable(Times.once());
        browserWindowMock.setup(b => b.minimize()).verifiable(Times.once());
    }
});
