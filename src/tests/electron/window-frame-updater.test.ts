// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { WindowFrameUpdater } from 'electron/window-frame-updater';
import { IMock, Mock, MockBehavior, Times, ExpectedCallType } from 'typemoq';

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
        windowFrameActions.maximize.invoke();

        browserWindowMock.setup(b => b.maximize()).verifiable(Times.never());
    });

    describe('verify action listeners', () => {
        beforeEach(() => {
            testSubject.initialize();
        });

        it('invokes maximize', () => {
            browserWindowMock.setup(b => b.maximize()).verifiable(Times.once());

            windowFrameActions.maximize.invoke();
        });

        it('invokes minimize', () => {
            browserWindowMock.setup(b => b.minimize()).verifiable(Times.once());

            windowFrameActions.minimize.invoke();
        });

        it('invokes restore', () => {
            browserWindowMock.setup(b => b.restore()).verifiable(Times.once());

            windowFrameActions.restore.invoke();
        });

        it('invokes close', () => {
            browserWindowMock.setup(b => b.close()).verifiable(Times.once());

            windowFrameActions.close.invoke();
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
