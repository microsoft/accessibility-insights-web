// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue, Rectangle } from 'electron';
import {
    SetSizePayload,
    WindowBoundsChangedPayload,
} from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_WINDOWBOUNDSCHANGED_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_FULL_SCREEN_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME,
    IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETWINDOWBOUNDS_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG,
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
            IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME,
            IPC_FROMBROWSERWINDOW_WINDOWBOUNDSCHANGED_CHANNEL_NAME,
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
            testSubject.fromBrowserWindowEnterFullScreen.addListener(async () => {
                callCount++;
            });
            ipcHandlers[IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowMaximize on maximize message from browser', () => {
            let callCount = 0;
            testSubject.fromBrowserWindowMaximize.addListener(async () => {
                callCount++;
            });
            ipcHandlers[IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowUnmaximize on unmaximize message from browser', () => {
            let callCount = 0;
            testSubject.fromBrowserWindowUnmaximize.addListener(async () => {
                callCount++;
            });
            ipcHandlers[IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowWindowBoundsChanged on windowBoundsChanged message from browser', () => {
            const payload: WindowBoundsChangedPayload = {
                windowState: 'normal',
                windowBounds: { x: 1, y: 2, width: 100, height: 200 },
            };
            let callCount = 0;
            testSubject.fromBrowserWindowWindowBoundsChanged.addListener(() => callCount++);
            ipcHandlers[IPC_FROMBROWSERWINDOW_WINDOWBOUNDSCHANGED_CHANNEL_NAME](payload);
            expect(callCount).toBe(1);
        });

        it('invoke fromBrowserWindowClose on close message from browser, calls closeWindow, is async', async () => {
            let callCount = 0;
            ipcRendererMock
                .setup(m => m.send(IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.fromBrowserWindowClose.addListener(() => {
                callCount++;
                return Promise.resolve();
            });
            await ipcHandlers[IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME]();
            expect(callCount).toBe(1);
        });

        it('initializeWindow sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.initializeWindow();
        });

        it('enterFullScreen sends correct ipc message', () => {
            ipcRendererMock
                .setup(b => b.send(IPC_FROMRENDERER_FULL_SCREEN_BROWSER_WINDOW_CHANNEL_NAME))
                .verifiable(Times.once());
            testSubject.enterFullScreen();
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

        it('setWindowBounds sends correct ipc message with correct payload', () => {
            const expectedBounds: Rectangle = { x: 40, y: 30, width: 200, height: 100 };
            let actualBounds: Rectangle = null;

            ipcRendererMock
                .setup(b =>
                    b.send(
                        IPC_FROMRENDERER_SETWINDOWBOUNDS_BROWSER_WINDOW_CHANNEL_NAME,
                        It.isAny(),
                    ),
                )
                .callback((_: string, args: Rectangle) => {
                    actualBounds = args;
                })
                .verifiable(Times.once());
            testSubject.setWindowBounds(expectedBounds);
            expect(actualBounds).toStrictEqual(expectedBounds);
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

        describe('showOpenFileDialog', () => {
            it('defers to the expected invoke call', async () => {
                const opts: OpenDialogOptions = { properties: ['createDirectory'] };
                const output: OpenDialogReturnValue = { canceled: false, filePaths: ['/path/1'] };
                ipcRendererMock
                    .setup(m => m.invoke(IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG, opts))
                    .returns(() => Promise.resolve(output))
                    .verifiable(Times.once());

                expect(await testSubject.showOpenFileDialog(opts)).toBe(output);
            });

            it('propagates errors from the invoke call', async () => {
                const error = new Error('test error message');
                const opts: OpenDialogOptions = { properties: ['createDirectory'] };
                ipcRendererMock
                    .setup(m => m.invoke(IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG, opts))
                    .returns(() => Promise.reject(error))
                    .verifiable(Times.once());

                await expect(testSubject.showOpenFileDialog(opts)).rejects.toThrowError(error);
            });
        });
    });
});
