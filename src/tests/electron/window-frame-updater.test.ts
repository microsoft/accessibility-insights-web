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
    let changeListener: (state: WindowStateStoreData) => Promise<void>;

    beforeEach(async () => {
        windowStateStoreMock = Mock.ofType(WindowStateStore);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);

        windowStateStoreMock
            .setup(w => w.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListener = cb;
            });

        testSubject = new WindowFrameUpdater(windowStateStoreMock.object, browserWindowMock.object);
    });

    describe('initialize', () => {
        test.each(['deviceConnectView', 'resultsView'] as ViewRoutes[])('updates window based on initial state', async routeId => {
            if (routeId === 'resultsView') {
                setupVerifiableCallsForResultsView();
            } else if (routeId === 'deviceConnectView') {
                setupVerifiableCallsForDeviceConnectRoute();
            }
            const windowStoreState: WindowStateStoreData = {
                routeId,
            };

            windowStateStoreMock
                .setup(w => w.getState())
                .returns(() => windowStoreState)
                .verifiable(Times.once());

            await testSubject.initialize();

            windowStateStoreMock.verifyAll();
            browserWindowMock.verifyAll();
        });
    });

    describe('verify change listener', () => {
        let windowStoreState: WindowStateStoreData;
        beforeEach(async () => {
            windowStoreState = {
                routeId: 'deviceConnectView',
            };

            windowStateStoreMock
                .setup(w => w.getState())
                .returns(() => windowStoreState)
                .verifiable(Times.once());

            browserWindowMock.setup(b => b.setSize(It.isAny(), It.isAny()));

            await testSubject.initialize();
            browserWindowMock.reset();
        });

        it('sets window state to deviceConnectView', async () => {
            setupVerifiableCallsForDeviceConnectRoute();

            await changeListener({ routeId: 'deviceConnectView' });

            browserWindowMock.verifyAll();
        });

        it('sets window state to results view', async () => {
            setupVerifiableCallsForResultsView();
            await changeListener({ routeId: 'resultsView' });

            browserWindowMock.verifyAll();
        });
    });

    function setupVerifiableCallsForDeviceConnectRoute(): void {
        browserWindowMock.setup(b => b.setSize(600, 391)).verifiable(Times.once());
    }

    function setupVerifiableCallsForResultsView(): void {
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());
    }
});
