// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IpcRenderer } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_APP_VERSION_CHANNEL_NAME,
    IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME,
    IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME,
    IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
} from 'electron/ipc/ipc-channel-names';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(IpcRendererShim, () => {
    let ipcRendererMock: IMock<IpcRenderer>;
    let testSubject: IpcRendererShim;

    beforeEach(() => {
        ipcRendererMock = Mock.ofType<IpcRenderer>(undefined, MockBehavior.Strict);
        testSubject = new IpcRendererShim(ipcRendererMock.object);
    });

    afterEach(() => {
        ipcRendererMock.verifyAll();
    });

    it('do nothing at construction', () => {});

    describe('tests after initialization', () => {
        const initializationMessages = [
            IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
            IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
            IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
        ];

        let ipcHandlers;

        function setupToAddOneIpcChannel(channelName: string): void {
            ipcRendererMock
                .setup(b => b.on(channelName, It.isAny()))
                .callback((event, handler) => (ipcHandlers[event] = handler))
                .verifiable(Times.once());
        }

        beforeEach(() => {
            ipcHandlers = {};
            initializationMessages.forEach(setupToAddOneIpcChannel);
            testSubject.initialize();
        });

        it('Set up handlers on initialization', () => {});

        it('invoke enterFullScreen action on enterFullScreen ipc message', () => {
            let callCount = 0;
            testSubject.enterFullScreenEvent.addListener(() => callCount++);
            ipcHandlers[IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke maximize action on maximize ipc message', () => {
            let callCount = 0;
            testSubject.maximizeEvent.addListener(() => callCount++);
            ipcHandlers[IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke unmaximize action on unmaximize ipc message', () => {
            let callCount = 0;
            testSubject.unmaximizeEvent.addListener(() => callCount++);
            ipcHandlers[IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('initializeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.initializeWindow();
        });

        it('maximizeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.maximizeWindow();
        });

        it('minimizeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.minimizeWindow();
        });

        it('restoreWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.restoreWindow();
        });

        it('closeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.closeWindow();
        });

        it('setSizeAndCenterWindow sends correct ipc message with correct payload', () => {
            const expectedHeight = 123;
            const expectedWidth = 456;
            let actualHeight: number;
            let actualWidth: number;

            ipcRendererMock
                .setup(b => b.send(IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME, It.isAny()))
                .callback((event: string, args: SetSizePayload) => {
                    actualHeight = args.height;
                    actualWidth = args.width;
                })
                .verifiable(Times.once());
            testSubject.setSizeAndCenterWindow({ height: expectedHeight, width: expectedWidth });
            expect(actualHeight).toBe(expectedHeight);
            expect(actualWidth).toBe(expectedWidth);
        });

        it('getVersion sends correct synchronous ipc message and returns result', () => {
            const expectedVersion = 'Version of the day';

            ipcRendererMock
                .setup(b => b.sendSync(IPC_APP_VERSION_CHANNEL_NAME))
                .returns(() => expectedVersion)
                .verifiable(Times.once());
            expect(testSubject.getVersion()).toBe(expectedVersion);
        });
    });
});
