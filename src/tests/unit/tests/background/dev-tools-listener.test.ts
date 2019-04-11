// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DevToolsListener } from '../../../../background/dev-tools-listener';
import { Interpreter } from '../../../../background/interpreter';
import { TabContext, TabToContextMap } from '../../../../background/tab-context';
import { ConnectionNames } from '../../../../common/constants/connection-names';
import { Messages } from '../../../../common/messages';
import { DevToolsOpenMessage } from '../../../../common/types/dev-tools-open-message';
import { ChromeAdapterMock, PortWithTabTabIdStub } from '../../mock-helpers/chrome-adapter-mock';
import { PortOnDisconnectMock } from '../../mock-helpers/port-on-disconnect-mock';
import { PortOnMessageMock } from '../../mock-helpers/port-on-message-mock';
import { PortStub } from '../../stubs/port-stub';

describe('DevToolsListenerTests', () => {
    let _testSubject: DevToolsListener;
    let _chromeAdapterMock: ChromeAdapterMock;
    let _backgrountConnectionMock: IMock<chrome.runtime.Port>;
    let _tabIdToContextMap: TabToContextMap;
    let _tabId1InterpreterMock: IMock<Interpreter>;
    let _tabId2InterpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        _tabId1InterpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        _tabId2InterpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        _tabIdToContextMap = {
            1: new TabContext(_tabId1InterpreterMock.object, null),
            2: new TabContext(_tabId2InterpreterMock.object, null),
        };
        _chromeAdapterMock = new ChromeAdapterMock();
        _backgrountConnectionMock = Mock.ofType(PortStub);
        _testSubject = new DevToolsListener(_tabIdToContextMap, _chromeAdapterMock.getObject());
    });

    test('initialize - ignore non-dev tools connections', () => {
        const portMock = Mock.ofType(PortWithTabTabIdStub, MockBehavior.Strict);
        let listenerCB: (port: PortWithTabTabIdStub) => void;

        portMock
            .setup(x => x.name)
            .returns(() => 'some other connection')
            .verifiable();

        _chromeAdapterMock.setUpAddListenerOnConnect(cb => {
            listenerCB = cb;
        });

        _testSubject.initialize();

        listenerCB(portMock.object);

        portMock.verifyAll();
        _chromeAdapterMock.verifyAll();
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

        _chromeAdapterMock.setUpAddListenerOnConnect(cb => {
            listenerCB = cb;
        });

        _testSubject.initialize();

        listenerCB(portStub);

        _chromeAdapterMock.verifyAll();
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

        _chromeAdapterMock.setUpAddListenerOnConnect(cb => {
            connectListenerCB = cb;
        });

        _tabId2InterpreterMock
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

        _testSubject.initialize();
        connectListenerCB(portStub);

        messageListenerCB({ tabId: 2 }, null);

        _chromeAdapterMock.verifyAll();
        onMessagePortMock.verify();
        onDisconnectPortMock.verify();

        expect(portStub.targetPageTabId).toBe(2);
        _tabId2InterpreterMock.verifyAll();
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

        _chromeAdapterMock.setUpAddListenerOnConnect(cb => {
            connectListenerCB = cb;
        });

        _tabId2InterpreterMock
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

        _testSubject.initialize();
        connectListenerCB(portStub);

        disconnectMessageCB({ tabId: 2 }, null);

        _chromeAdapterMock.verifyAll();
        onMessagePortMockValidator.verify();
        onDisconnectPortMockValidator.verify();

        _tabId2InterpreterMock.verifyAll();
    });
});
