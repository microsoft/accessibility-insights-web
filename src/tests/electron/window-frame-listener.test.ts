// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { WindowFrameListener } from 'electron/window-frame-listener';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowFrameListener, () => {
    let windowStateActionsCreatorMock: IMock<WindowStateActionCreator>;
    let testSubject: WindowFrameListener;
    let browserWindowMock: IMock<BrowserWindow>;

    beforeEach(() => {
        windowStateActionsCreatorMock = Mock.ofType(WindowStateActionCreator);
        browserWindowMock = Mock.ofType(BrowserWindow, MockBehavior.Strict);

        testSubject = new WindowFrameListener(windowStateActionsCreatorMock.object, browserWindowMock.object);
    });

    afterEach(() => {
        browserWindowMock.verifyAll();
    });

    it('do nothing on action invocation before initialize', () => {
        browserWindowMock.setup(b => b.on(It.isAny(), It.isAny())).verifiable(Times.never());
    });

    describe('initialize', () => {
        it('registers to required window events', () => {
            const eventCallbacks: Function[] = [];

            const eventsToListen = ['minimize', 'maximize', 'unmaximize'];
            eventsToListen.forEach(eventName => {
                browserWindowMock
                    .setup(b => b.on(eventName as any, It.isAny()))
                    .callback((event, cb) => {
                        eventCallbacks.push(cb);
                    })
                    .verifiable(Times.once());
            });

            testSubject.initialize();

            expect(eventCallbacks.length).toBe(eventsToListen.length);
            expect(new Set(eventCallbacks).size).toBe(1);
        });
    });

    describe('verify action listeners', () => {
        let eventCallback: Function = null;

        beforeEach(() => {
            const eventsToListen = ['minimize', 'maximize', 'unmaximize'];
            eventsToListen.forEach(eventName => {
                browserWindowMock
                    .setup(b => b.on(eventName as any, It.isAny()))
                    .callback((event, cb) => {
                        eventCallback = cb;
                    });
            });

            testSubject.initialize();
        });

        it('invokes maximize', () => {
            browserWindowMock.setup(b => b.isMinimized()).returns(() => false);

            browserWindowMock.setup(b => b.isMaximized()).returns(() => true);

            windowStateActionsCreatorMock.setup(b => b.setWindowState({ currentWindowState: 'maximized' })).verifiable(Times.once());

            eventCallback();
        });

        it('invokes minimize', () => {
            browserWindowMock.setup(b => b.isMinimized()).returns(() => true);

            windowStateActionsCreatorMock.setup(b => b.setWindowState({ currentWindowState: 'minimized' })).verifiable(Times.once());

            eventCallback();
        });

        it('invokes customSize', () => {
            browserWindowMock.setup(b => b.isMinimized()).returns(() => false);

            browserWindowMock.setup(b => b.isMaximized()).returns(() => false);

            windowStateActionsCreatorMock.setup(b => b.setWindowState({ currentWindowState: 'customSize' })).verifiable(Times.once());

            eventCallback();
        });
    });
});
