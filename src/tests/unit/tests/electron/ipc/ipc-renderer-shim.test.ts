// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IpcRenderer } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME,
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
            IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
            IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
            IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
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

        it('invoke fromBrowserWindowEnterFullScreen on enterFullScreen message from browser', () => {
            let callCount = 0;
            testSubject.fromBrowserWindowEnterFullScreen.addListener(() => callCount++);
            ipcHandlers[IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowMaximize action  maximize message from browser', () => {
            let callCount = 0;
            testSubject.fromBrowserWindowMaximize.addListener(() => callCount++);
            ipcHandlers[IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowUnmaximize  on unmaximize message from browser', () => {
            let callCount = 0;
            testSubject.fromBrowserWindowUnmaximize.addListener(() => callCount++);
            ipcHandlers[IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('initializeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.initializeWindow();
        });

        it('maximizeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.maximizeWindow();
        });

        it('minimizeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.minimizeWindow();
        });

        it('restoreWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.restoreWindow();
        });

        it('closeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.closeWindow();
        });

        it('setSizeAndCenterWindow sends correct ipc message with correct payload', () => {
            const expectedHeight = 123;
            const expectedWidth = 456;
            let actualHeight: number;
            let actualWidth: number;

            ipcRendererMock
                .setup(b =>
                    b.send(
                        IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
                        It.isAny(),
                    ),
                )
                .callback((event: string, args: SetSizePayload) => {
                    actualHeight = args.height;
                    actualWidth = args.width;
                })
                .verifiable(Times.once());
            testSubject.setSizeAndCenterWindow({ height: expectedHeight, width: expectedWidth });
            expect(actualHeight).toBe(expectedHeight);
            expect(actualWidth).toBe(expectedWidth);
        });

        describe('getAppPath', () => {
            it('defers to the expected invoke call', async () => {
                const appPath = '/test/path';
                ipcRendererMock
                    .setup(m => m.invoke(IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME))
                    .returns(() => Promise.resolve(appPath))
                    .verifiable(Times.once());

                expect(await testSubject.getAppPath()).toBe(appPath);
            });

            it('propagates errors from the invoke call', async () => {
                const error = new Error('test error message');
                ipcRendererMock
                    .setup(m => m.invoke(IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME))
                    .returns(() => Promise.reject(error))
                    .verifiable(Times.once());

                await expect(testSubject.getAppPath()).rejects.toThrowError(error);
            });
        });
    });
});
