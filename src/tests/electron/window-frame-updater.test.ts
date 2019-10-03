// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowFrameUpdater } from 'electron/window-frame-updater';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { WindowStateStore } from '../../electron/flux/store/window-state-store';
import { WindowStateStoreData } from '../../electron/flux/types/window-state-store-data';

describe(WindowFrameUpdater, () => {
    let windowStateStoreMock: IMock<WindowStateStore>;
    let testSubject: WindowFrameUpdater;
    let browserWindowMock: IMock<BrowserWindow>;
    let changeListener: (state: WindowStateStoreData) => Promise<void>;

    beforeEach(() => {
        windowStateStoreMock = Mock.ofType(WindowStateStore);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);

        windowStateStoreMock
            .setup(w => w.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListener = cb;
            });

        testSubject = new WindowFrameUpdater(windowStateStoreMock.object, browserWindowMock.object);
        testSubject.initialize();
    });

    it('sets window state to deviceConnectView', async () => {
        browserWindowMock.setup(b => b.setSize(600, 391)).verifiable(Times.once());

        await changeListener({ routeId: 'deviceConnectView' });

        browserWindowMock.verifyAll();
    });

    it('sets window state to results view', async () => {
        browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());

        await changeListener({ routeId: 'resultsView' });

        browserWindowMock.verifyAll();
    });
});
