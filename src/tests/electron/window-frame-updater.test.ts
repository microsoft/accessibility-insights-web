// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { WindowFrameUpdater } from 'electron/window-frame-updater';
import { ExpectedCallType, IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameUpdater, () => {
    let windowFrameActions: WindowFrameActions;
    let testSubject: WindowFrameUpdater;
    let browserWindowMock: IMock<BrowserWindow>;

    beforeEach(() => {
        windowFrameActions = new WindowFrameActions();
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);

        testSubject = new WindowFrameUpdater(windowFrameActions, browserWindowMock.object);
    });

    afterEach(() => {
        browserWindowMock.verifyAll();
    });

    it(' do nothing on action invocation before initialize', () => {
        windowFrameActions.maximize.invoke(null);

        browserWindowMock.setup(b => b.maximize()).verifiable(Times.never());
    });

    describe('verify action listeners', () => {
        beforeEach(() => {
            testSubject.initialize();
        });

        it('invokes maximize', () => {
            browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());

            windowFrameActions.maximize.invoke(null);
        });

        it('invokes minimize', () => {
            browserWindowMock.setup(b => b.minimize()).verifiable(Times.once());

            windowFrameActions.minimize.invoke(null);
        });

        it('handles restore when in full screen', () => {
            browserWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => true)
                .verifiable(Times.once());
            browserWindowMock.setup(b => b.setFullScreen(false)).verifiable(Times.once());

            windowFrameActions.restore.invoke(null);
        });

        it('handles restore when not in full screen', () => {
            browserWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => false)
                .verifiable(Times.once());
            browserWindowMock.setup(b => b.unmaximize()).verifiable(Times.once());

            windowFrameActions.restore.invoke(null);
        });

        it('invokes close', () => {
            browserWindowMock.setup(b => b.close()).verifiable(Times.once());

            windowFrameActions.close.invoke(null);
        });

        it('invokes setSize', () => {
            const sizePayload: SetSizePayload = {
                width: 12,
                height: 34,
            };

            browserWindowMock
                .setup(b => b.setSize(sizePayload.width, sizePayload.height))
                .verifiable(Times.once(), ExpectedCallType.InSequence);
            browserWindowMock.setup(b => b.center()).verifiable(Times.once(), ExpectedCallType.InSequence);

            windowFrameActions.setWindowSize.invoke(sizePayload);
        });
    });
});
