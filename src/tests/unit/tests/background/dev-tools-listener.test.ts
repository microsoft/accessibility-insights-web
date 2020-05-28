// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsListener } from 'background/dev-tools-listener';
import { Interpreter } from 'background/interpreter';
import { TabContext, TabToContextMap } from 'background/tab-context';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ConnectionNames } from '../../../../common/constants/connection-names';
import { Messages } from '../../../../common/messages';
import { DevToolsOpenMessage } from '../../../../common/types/dev-tools-open-message';
import {
    DevToolsBrowserAdapterMock,
    PortWithTabTabIdStub,
} from '../../mock-helpers/dev-tools-chrome-adapter-mock';
import { PortOnDisconnectMock } from '../../mock-helpers/port-on-disconnect-mock';
import { PortOnMessageMock } from '../../mock-helpers/port-on-message-mock';

describe('DevToolsListenerTests', () => {
    let testSubject: DevToolsListener;
    let browserAdapterMock: DevToolsBrowserAdapterMock;
    let tabIdToContextMap: TabToContextMap;
    let tabId1InterpreterMock: IMock<Interpreter>;
    let tabId2InterpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        tabId1InterpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        tabId2InterpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        tabIdToContextMap = {
            1: new TabContext(tabId1InterpreterMock.object, null),
            2: new TabContext(tabId2InterpreterMock.object, null),
        };
        browserAdapterMock = new DevToolsBrowserAdapterMock();
        testSubject = new DevToolsListener(tabIdToContextMap, browserAdapterMock.getObject());
    });

    test('initialize - ignore non-dev tools connections', () => {
        const portMock = Mock.ofType(PortWithTabTabIdStub, MockBehavior.Strict);
        let listenerCB: (port: PortWithTabTabIdStub) => void;

        portMock
            .setup(x => x.name)
            .returns(() => 'some other connection')
            .verifiable();

        browserAdapterMock.setUpAddListenerOnConnect(cb => {
            listenerCB = cb;
        });

        testSubject.initialize();

        listenerCB(portMock.object);

        portMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    test('initialize - ignore if tab context does not exist', () => {
        const onMessagePortMock = new PortOnMessageMock();
        const onDisconnectPortMock = new PortOnDisconnectMock();
        const portStub = new PortWithTabTabIdStub(
            ConnectionNames.devTools,
            onMessagePortMock.getObject(),
            onDisconnectPortMock.getObject(),
        );
        let listenerCB: (port: PortWithTabTabIdStub) => void;

        portStub.targetPageTabId = 10;

        onMessagePortMock.setupAddListenerMock();
        onDisconnectPortMock.setupAddListenerMock();

        browserAdapterMock.setUpAddListenerOnConnect(cb => {
            listenerCB = cb;
        });

        testSubject.initialize();

        listenerCB(portStub);

        browserAdapterMock.verifyAll();
        onMessagePortMock.verify();
        onDisconnectPortMock.verify();
    });

    test('initialize - devtools opened - call interpreter with status true', () => {
        const onMessagePortMock = new PortOnMessageMock();
        const onDisconnectPortMock = new PortOnDisconnectMock();
        const portStub = new PortWithTabTabIdStub(
            ConnectionNames.devTools,
            onMessagePortMock.getObject(),
            onDisconnectPortMock.getObject(),
        );
        let connectListenerCB: (port: PortWithTabTabIdStub) => void;
        let messageListenerCB: (message: DevToolsOpenMessage, port: chrome.runtime.Port) => void;

        onMessagePortMock.setupAddListenerMock(cb => {
            messageListenerCB = cb;
        });
        onDisconnectPortMock.setupAddListenerMock();

        browserAdapterMock.setUpAddListenerOnConnect(cb => {
            connectListenerCB = cb;
        });

        tabId2InterpreterMock
            .setup(x =>
                x.interpret(
                    It.isValue({
                        payload: {
                            status: true,
                        },
                        tabId: 2,
                        messageType: Messages.DevTools.DevtoolStatus,
                    }),
                ),
            )
            .verifiable(Times.once());

        testSubject.initialize();
        connectListenerCB(portStub);

        messageListenerCB({ tabId: 2 }, null);

        browserAdapterMock.verifyAll();
        onMessagePortMock.verify();
        onDisconnectPortMock.verify();

        expect(portStub.targetPageTabId).toBe(2);
        tabId2InterpreterMock.verifyAll();
    });

    test('initialize - disconnect - call interpreter with status false', () => {
        const onMessagePortMockValidator = new PortOnMessageMock();
        const onDisconnectPortMockValidator = new PortOnDisconnectMock();
        const portStub = new PortWithTabTabIdStub(
            ConnectionNames.devTools,
            onMessagePortMockValidator.getObject(),
            onDisconnectPortMockValidator.getObject(),
        );
        let connectListenerCB: (port: PortWithTabTabIdStub) => void;
        let disconnectMessageCB: (message: DevToolsOpenMessage, port: chrome.runtime.Port) => void;

        portStub.targetPageTabId = 2;

        onMessagePortMockValidator.setupAddListenerMock();
        onMessagePortMockValidator.setupRemoveListener();
        onDisconnectPortMockValidator.setupAddListenerMock(cb => {
            disconnectMessageCB = cb;
        });

        browserAdapterMock.setUpAddListenerOnConnect(cb => {
            connectListenerCB = cb;
        });

        tabId2InterpreterMock
            .setup(x =>
                x.interpret(
                    It.isValue({
                        payload: {
                            status: false,
                        },
                        tabId: 2,
                        messageType: Messages.DevTools.DevtoolStatus,
                    }),
                ),
            )
            .verifiable(Times.once());

        testSubject.initialize();
        connectListenerCB(portStub);

        disconnectMessageCB({ tabId: 2 }, null);

        browserAdapterMock.verifyAll();
        onMessagePortMockValidator.verify();
        onDisconnectPortMockValidator.verify();

        tabId2InterpreterMock.verifyAll();
    });
});
