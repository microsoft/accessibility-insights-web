// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowFrameUpdater } from 'electron/window-frame-updater';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { WindowStateStore } from '../../electron/flux/store/window-state-store';

describe(WindowFrameUpdater, () => {
    let windowStateStoreMock: IMock<WindowStateStore>;
    let testSubject: WindowFrameUpdater;
    let browserWindowMock: IMock<BrowserWindow>;
    let changeListeners: ((store: WindowStateStore) => void)[];
    beforeEach(() => {
        changeListeners = [];
        windowStateStoreMock = Mock.ofType(WindowStateStore);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);

        windowStateStoreMock
            .setup(w => w.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListeners.push(cb);
            });

        testSubject = new WindowFrameUpdater(windowStateStoreMock.object, browserWindowMock.object);
        testSubject.initialize();
    });

    it('sets window state to deviceConnectView', () => {
        browserWindowMock.setup(b => b.setSize(600, 391)).verifiable(Times.once());
        browserWindowMock.setup(b => b.isMaximized()).verifiable(Times.exactly(2));
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());

        windowStateStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return { routeId: 'deviceConnectView', currentWindowState: 'restoredOrMaximized' };
            })
            .verifiable(Times.once());

        changeListeners.forEach(fn => fn(windowStateStoreMock.object));

        browserWindowMock.verifyAll();
    });

    it('sets window state to results view', () => {
        browserWindowMock.setup(b => b.isMaximized()).verifiable(Times.once());
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.exactly(2));

        windowStateStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return { routeId: 'resultsView', currentWindowState: 'restoredOrMaximized' };
            })
            .verifiable(Times.once());

        changeListeners.forEach(fn => fn(windowStateStoreMock.object));

        browserWindowMock.verifyAll();
    });

    it('minimizes the window', () => {
        browserWindowMock.setup(b => b.minimize()).verifiable(Times.once());

        browserWindowMock
            .setup(b => b.isMaximized())
            .returns(() => true)
            .verifiable(Times.once());

        browserWindowMock
            .setup(b => b.isMinimized())
            .returns(() => false)
            .verifiable(Times.once());

        windowStateStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return { routeId: 'deviceConnectView', currentWindowState: 'minimized' };
            })
            .verifiable(Times.once());

        changeListeners.forEach(fn => fn(windowStateStoreMock.target));

        browserWindowMock.verifyAll();
    });

    it('maximizes the window', () => {
        browserWindowMock.setup(b => b.setSize(600, 391)).verifiable(Times.once());
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());
        browserWindowMock.setup(b => b.isMaximized()).verifiable(Times.exactly(2));

        windowStateStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return { routeId: 'deviceConnectView', currentWindowState: 'restoredOrMaximized' };
            })
            .verifiable(Times.once());

        changeListeners.forEach(fn => fn(windowStateStoreMock.object));

        browserWindowMock.verifyAll();
    });

    it('unmaximizes the window', () => {
        browserWindowMock.setup(b => b.unmaximize()).verifiable(Times.once());

        browserWindowMock
            .setup(b => b.isMaximized())
            .returns(() => true)
            .verifiable(Times.exactly(2));

        windowStateStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return { routeId: 'deviceConnectView', currentWindowState: 'restoredOrMaximized' };
            })
            .verifiable(Times.once());

        changeListeners.forEach(fn => fn(windowStateStoreMock.object));

        browserWindowMock.verifyAll();
    });
});
