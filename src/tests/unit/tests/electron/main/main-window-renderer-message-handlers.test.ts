// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { App, BrowserWindow, IpcMain, IpcMainEvent, WebContents } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import {
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
} from 'electron/ipc/ipc-channel-names';
import { MainWindowRendererMessageHandlers } from 'electron/main/main-window-renderer-message-handlers';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(MainWindowRendererMessageHandlers, () => {
    const stubElectronEvent = {} as Electron.Event;
    const stubIpcMainEvent = {} as IpcMainEvent;

    const maximize = 'maximize';
    const unmaximize = 'unmaximize';
    const enterFullScreen = 'enter-full-screen';
    const leaveFullScreen = 'leave-full-screen';

    const ipcChannelHandlerNames = [IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME];

    const ipcChannelListenerNames = [
        IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
        IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
        IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
        IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
        IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
    ];

    const windowEventNames = [maximize, unmaximize, enterFullScreen, leaveFullScreen];

    let mainWindowMock: IMock<BrowserWindow>;
    let ipcMainMock: IMock<IpcMain>;
    let appMock: IMock<App>;
    let testSubject: MainWindowRendererMessageHandlers;
    let ipcHandlers: { [channelName: string]: (event: IpcMainEvent, args?: any) => Promise<any> };
    let ipcListeners: { [channelName: string]: (event: IpcMainEvent, args?: any) => void };
    let windowHandlers: { [channelName: string]: (event: Electron.Event, args?: any) => void };
    let expectedIpcChannelHandlers: number;
    let expectedIpcChannelListeners: number;
    let expectedWindowEvents: number;

    function setupToAddOneIpcChannelHandler(channelName: string): void {
        ipcMainMock
            .setup(b => b.handle(channelName, It.isAny()))
            .callback((event, handler) => (ipcHandlers[event] = handler))
            .verifiable(Times.once());
        expectedIpcChannelHandlers++;
    }

    function setupToRemoveOneIpcChannelHandler(channelName: string): void {
        ipcMainMock
            .setup(b => b.removeHandler(channelName))
            .callback(name => {
                delete ipcHandlers[name];
            })
            .verifiable(Times.once());
        expectedIpcChannelHandlers--;
    }

    function setupToAddOneIpcChannelListener(channelName: string): void {
        ipcMainMock
            .setup(b => b.on(channelName, It.isAny()))
            .callback((event, listener) => (ipcListeners[event] = listener))
            .verifiable(Times.once());
        expectedIpcChannelListeners++;
    }

    function setupToRemoveOneIpcChannelListener(channelName: string): void {
        ipcMainMock
            .setup(b => b.removeListener(channelName, It.isAny()))
            .callback((name, listener) => {
                delete ipcListeners[name];
            })
            .verifiable(Times.once());
        expectedIpcChannelListeners--;
    }

    function setupToAddOneWindowEvent(eventName: string): void {
        mainWindowMock
            .setup(b => b.on(eventName as any, It.isAny()))
            .callback((event, handler) => {
                windowHandlers[event] = handler;
            })
            .verifiable(Times.once());
        expectedWindowEvents++;
    }

    function setupToRemoveOneWindowEvent(eventName: string): void {
        mainWindowMock
            .setup(b => b.removeListener(eventName as any, It.isAny()))
            .callback((name, handler) => {
                delete windowHandlers[name];
            })
            .verifiable(Times.once());
        expectedWindowEvents--;
    }

    beforeEach(() => {
        ipcHandlers = {};
        ipcListeners = {};
        windowHandlers = {};
        expectedIpcChannelHandlers = 0;
        expectedIpcChannelListeners = 0;
        expectedWindowEvents = 0;

        mainWindowMock = Mock.ofType<BrowserWindow>(undefined, MockBehavior.Loose);
        ipcMainMock = Mock.ofType<IpcMain>(undefined, MockBehavior.Strict);
        appMock = Mock.ofType<App>(undefined, MockBehavior.Strict);

        testSubject = new MainWindowRendererMessageHandlers(
            mainWindowMock.object,
            ipcMainMock.object,
            appMock.object,
        );

        ipcChannelListenerNames.forEach(setupToAddOneIpcChannelListener);
        ipcChannelHandlerNames.forEach(setupToAddOneIpcChannelHandler);
        windowEventNames.forEach(setupToAddOneWindowEvent);
        testSubject.startListening();
    });

    afterEach(() => {
        mainWindowMock.verifyAll();
        ipcMainMock.verifyAll();
        appMock.verifyAll();
        expect(Object.keys(ipcHandlers).length).toBe(expectedIpcChannelHandlers);
        expect(Object.keys(ipcListeners).length).toBe(expectedIpcChannelListeners);
        expect(Object.keys(windowHandlers).length).toBe(expectedWindowEvents);
    });

    it('verify startListening', () => {});

    describe('verify listeners on ipcMain', () => {
        it('maximize maximizes browserWindow', () => {
            mainWindowMock.setup(b => b.maximize).verifiable(Times.once());
            ipcListeners[IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME](stubIpcMainEvent);
        });

        it('minimize minimizes browserWindow', () => {
            mainWindowMock.setup(b => b.minimize).verifiable(Times.once());
            ipcListeners[IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME](stubIpcMainEvent);
        });

        it('close closes browserWindow', () => {
            mainWindowMock.setup(b => b.close).verifiable(Times.once());
            ipcListeners[IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME](stubIpcMainEvent);
        });

        it('restore sets browserWindow fullScreen to false if fullScreen is initially true', () => {
            mainWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => true)
                .verifiable(Times.once());
            mainWindowMock.setup(b => b.setFullScreen(false)).verifiable(Times.once());

            ipcListeners[IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME](stubIpcMainEvent);
        });

        it('restore unmaximizes browserWindow if fullScreen is initially false', () => {
            mainWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => false)
                .verifiable(Times.once());
            mainWindowMock.setup(b => b.unmaximize).verifiable(Times.once());

            ipcListeners[IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME](stubIpcMainEvent);
        });

        it('setSizeAndCenter sets the correct size and centers the browserWindow', () => {
            const height = 56;
            const width = 78;
            const payload: SetSizePayload = {
                height,
                width,
            };

            mainWindowMock.setup(b => b.setSize(width, height)).verifiable(Times.once());
            mainWindowMock.setup(b => b.center()).verifiable(Times.once());

            ipcListeners[IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME](
                stubIpcMainEvent,
                payload,
            );
        });

        it('uses app.getAppPath to handle GET_APP_PATH', async () => {
            const stubAppPath = 'stub app path';
            appMock
                .setup(m => m.getAppPath())
                .returns(() => stubAppPath)
                .verifiable();

            const result = await ipcHandlers[IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME](
                stubIpcMainEvent,
            );

            expect(result).toBe(stubAppPath);
        });

        it('StopListening removes all handlers', () => {
            ipcChannelHandlerNames.forEach(setupToRemoveOneIpcChannelHandler);
            ipcChannelListenerNames.forEach(setupToRemoveOneIpcChannelListener);
            windowEventNames.forEach(setupToRemoveOneWindowEvent);

            testSubject.stopListening();
        });
    });

    describe('verify listeners on mainWindow', () => {
        let webContentsMock: IMock<WebContents>;
        beforeEach(() => {
            webContentsMock = Mock.ofType<WebContents>(undefined, MockBehavior.Loose);

            mainWindowMock
                .setup(b => b.webContents)
                .returns(() => webContentsMock.object)
                .verifiable(Times.once());
        });

        afterEach(() => {
            webContentsMock.verifyAll();
        });

        it('BrowserWindow maximize triggers maximize message', () => {
            webContentsMock
                .setup(b => b.send(IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[maximize](stubElectronEvent);
        });

        it('BrowserWindow unmaximize triggers unmaximize message', () => {
            webContentsMock
                .setup(b => b.send(IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[unmaximize](stubElectronEvent);
        });

        it('BrowserWindow enter-full-screen triggers enterFullScreen message', () => {
            webContentsMock
                .setup(b => b.send(IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[enterFullScreen](stubElectronEvent);
        });

        it('BrowserWindow leave-full-screen triggers maximize message if maximized', () => {
            webContentsMock
                .setup(b => b.send(IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());
            mainWindowMock
                .setup(b => b.isMaximized())
                .returns(() => true)
                .verifiable(Times.once());
            windowHandlers[leaveFullScreen](stubElectronEvent);
        });

        it('BrowserWindow leave-full-screen triggers unmaximize message if not maximized', () => {
            webContentsMock
                .setup(b => b.send(IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());
            mainWindowMock
                .setup(b => b.isMaximized())
                .returns(() => false)
                .verifiable(Times.once());
            windowHandlers[leaveFullScreen](stubElectronEvent);
        });
    });
});
