// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { WindowFrameUpdater } from 'electron/window-management/window-frame-updater';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameUpdater, () => {
    let windowFrameActions: WindowFrameActions;
    let testSubject: WindowFrameUpdater;
    let ipcRendererShimMock: IMock<IpcRendererShim>;

    beforeEach(() => {
        windowFrameActions = new WindowFrameActions();
        ipcRendererShimMock = Mock.ofType<IpcRendererShim>(undefined, MockBehavior.Strict);

        testSubject = new WindowFrameUpdater(windowFrameActions, ipcRendererShimMock.object);
    });

    afterEach(() => {
        ipcRendererShimMock.verifyAll();
    });

    it(' do nothing on action invocation before initialize', () => {
        windowFrameActions.maximize.invoke(null);
    });

    describe('verify action listeners', () => {
        beforeEach(() => {
            testSubject.initialize();
        });

        it('invokes enterFullScreen', () => {
            ipcRendererShimMock.setup(b => b.enterFullScreen()).verifiable(Times.once());

            windowFrameActions.enterFullScreen.invoke(null);
        });

        it('invokes maximize', () => {
            ipcRendererShimMock.setup(b => b.maximizeWindow()).verifiable(Times.once());

            windowFrameActions.maximize.invoke(null);
        });

        it('invokes minimize', () => {
            ipcRendererShimMock.setup(b => b.minimizeWindow()).verifiable(Times.once());

            windowFrameActions.minimize.invoke(null);
        });

        it('invokes restore', () => {
            ipcRendererShimMock.setup(b => b.restoreWindow()).verifiable(Times.once());

            windowFrameActions.restore.invoke(null);
        });

        it('invokes setSizeAndCenter', () => {
            const width = 12;
            const height = 34;

            let actualWidth: number;
            let actualHeight: number;
            const sizePayload: SetSizePayload = {
                width,
                height,
            };

            ipcRendererShimMock
                .setup(b => b.setSizeAndCenterWindow(It.isAny()))
                .callback(args => {
                    actualWidth = args.width;
                    actualHeight = args.height;
                })
                .verifiable(Times.once());

            windowFrameActions.setWindowSize.invoke(sizePayload);
            expect(actualHeight).toBe(height);
            expect(actualWidth).toBe(width);
        });
    });
});
