// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { App, BrowserWindow, IpcMain, IpcMainEvent, WebContents } from 'electron';
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
} from 'electron/ipc/ipc-channel-names';
import { MainWindowRendererMessageHandlers } from 'electron/main/main-window-renderer-message-handlers';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(MainWindowRendererMessageHandlers, () => {
    const maximize = 'maximize';
    const unmaximize = 'unmaximize';
    const enterFullScreen = 'enter-full-screen';
    const leaveFullScreen = 'leave-full-screen';

    const ipcChannelNames = [
        IPC_APP_VERSION_CHANNEL_NAME,
        IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
        IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME,
        IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME,
        IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME,
        IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME,
    ];

    const windowEventNames = [maximize, unmaximize, enterFullScreen, leaveFullScreen];

    let appMock: IMock<App>;
    let mainWindowMock: IMock<BrowserWindow>;
    let ipcMainMock: IMock<IpcMain>;
    let testSubject: MainWindowRendererMessageHandlers;
    let ipcHandlers;
    let windowHandlers;
    let expectedIpcChannels;
    let expectedWindowEvents;

    function setupToAddOneIpcChannel(channelName: string): void {
        ipcMainMock
            .setup(b => b.on(channelName, It.isAny()))
            .callback((event, handler) => (ipcHandlers[event] = handler))
            .verifiable(Times.once());
        expectedIpcChannels++;
    }

    function setupToRemoveOneIpcChannel(channelName: string): void {
        ipcMainMock
            .setup(b => b.removeListener(channelName, It.isAny()))
            .callback((event, handler) => {
                ipcHandlers = removeElement(ipcHandlers, event);
            })
            .verifiable(Times.once());
        expectedIpcChannels--;
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
            .callback((event, handler) => {
                windowHandlers = removeElement(windowHandlers, event);
            })
            .verifiable(Times.once());
        expectedWindowEvents--;
    }

    function removeElement(array: object, event: string): object {
        const newArray = {};

        Object.keys(array).forEach(key => {
            if (key !== event) {
                newArray[key] = array[key];
            }
        });

        return newArray;
    }

    beforeEach(() => {
        ipcHandlers = {};
        windowHandlers = {};
        expectedIpcChannels = 0;
        expectedWindowEvents = 0;

        appMock = Mock.ofType<App>(undefined, MockBehavior.Strict);
        mainWindowMock = Mock.ofType<BrowserWindow>(undefined, MockBehavior.Loose);
        ipcMainMock = Mock.ofType<IpcMain>(undefined, MockBehavior.Strict);

        testSubject = new MainWindowRendererMessageHandlers(
            appMock.object,
            mainWindowMock.object,
            ipcMainMock.object,
        );

        ipcChannelNames.forEach(setupToAddOneIpcChannel);
        windowEventNames.forEach(setupToAddOneWindowEvent);
        testSubject.startListening();
    });

    afterEach(() => {
        appMock.verifyAll();
        mainWindowMock.verifyAll();
        ipcMainMock.verifyAll();
        expect(Object.keys(ipcHandlers).length).toBe(expectedIpcChannels);
        expect(Object.keys(windowHandlers).length).toBe(expectedWindowEvents);
    });

    it('verify startListening', () => {});

    describe('verify listeners on ipcMain', () => {
        it('getVersion gets Version', () => {
            const expectedVersion = 'super ultra massively cool';

            appMock.setup(b => b.getVersion()).returns(() => expectedVersion);

            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_APP_VERSION_CHANNEL_NAME](event);

            expect(event.returnValue).toBe(expectedVersion);
        });

        it('maximize maximizes mainWindow', () => {
            mainWindowMock.setup(b => b.maximize).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME](event);
        });

        it('minimize minimizes mainWindow', () => {
            mainWindowMock.setup(b => b.minimize).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_MINIMIZE_CHANNEL_NAME](event);
        });

        it('close closes mainWindow', () => {
            mainWindowMock.setup(b => b.close).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_CLOSE_CHANNEL_NAME](event);
        });

        it('restore sets fullScreen to false if fullScreen is initially true', () => {
            mainWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => true)
                .verifiable(Times.once());
            mainWindowMock.setup(b => b.setFullScreen(false)).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME](event);
        });

        it('restore unmaximizes mainWindow if fullScreen is initially false', () => {
            mainWindowMock
                .setup(b => b.isFullScreen())
                .returns(() => false)
                .verifiable(Times.once());
            mainWindowMock.setup(b => b.unmaximize).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_RESTORE_CHANNEL_NAME](event);
        });

        it('setSizeAndCenter sets the correct size and centers the window', () => {
            const height = 56;
            const width = 78;
            const payload: SetSizePayload = {
                height,
                width,
            };

            mainWindowMock.setup(b => b.setSize(width, height)).verifiable(Times.once());
            mainWindowMock.setup(b => b.center()).verifiable(Times.once());
            const event = {} as IpcMainEvent;
            ipcHandlers[IPC_BROWSERWINDOW_SETSIZEANDCENTER_CHANNEL_NAME](event, payload);
        });

        it('StopListening removes all handlers', () => {
            ipcChannelNames.forEach(setupToRemoveOneIpcChannel);
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
                .setup(b => b.send(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[maximize]();
        });

        it('BrowserWindow unmaximize triggers unmaximize message', () => {
            webContentsMock
                .setup(b => b.send(IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[unmaximize]();
        });

        it('BrowserWindow enter-full-screen triggers enterFullScreen message', () => {
            webContentsMock
                .setup(b => b.send(IPC_BROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());

            windowHandlers[enterFullScreen]();
        });

        it('BrowserWindow leave-full-screen triggers maximize message if maximized', () => {
            webContentsMock
                .setup(b => b.send(IPC_BROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());
            mainWindowMock
                .setup(b => b.isMaximized())
                .returns(() => true)
                .verifiable(Times.once());
            windowHandlers[leaveFullScreen]();
        });

        it('BrowserWindow leave-full-screen triggers unmaximize message if not maximized', () => {
            webContentsMock
                .setup(b => b.send(IPC_BROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, It.isAny()))
                .verifiable(Times.once());
            mainWindowMock
                .setup(b => b.isMaximized())
                .returns(() => false)
                .verifiable(Times.once());
            windowHandlers[leaveFullScreen]();
        });
    });
});
