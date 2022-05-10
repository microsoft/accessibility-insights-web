// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsListener } from 'background/dev-tools-listener';
import { DevToolsMonitor } from 'background/dev-tools-monitor';
import { TabContextManager } from 'background/tab-context-manager';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ConnectionNames } from '../../../../common/constants/connection-names';
import { Messages } from '../../../../common/messages';
import { DevToolsOpenMessage } from '../../../../common/types/dev-tools-messages';
import {
    DevToolsBrowserAdapterMock,
    PortWithTabTabIdStub,
} from '../../mock-helpers/dev-tools-chrome-adapter-mock';
import { PortOnDisconnectMock } from '../../mock-helpers/port-on-disconnect-mock';
import { PortOnMessageMock } from '../../mock-helpers/port-on-message-mock';

describe('DevToolsListenerTests', () => {
    let testSubject: DevToolsListener;
    let browserAdapterMock: DevToolsBrowserAdapterMock;
    let tabContextManagerMock: IMock<TabContextManager>;
    let devToolsMonitorMock: IMock<DevToolsMonitor>;

    beforeEach(() => {
        tabContextManagerMock = Mock.ofType<TabContextManager>();
        browserAdapterMock = new DevToolsBrowserAdapterMock();
        devToolsMonitorMock = Mock.ofType<DevToolsMonitor>();
        testSubject = new DevToolsListener(
            tabContextManagerMock.object,
            browserAdapterMock.getObject(),
            devToolsMonitorMock.object,
        );
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

        tabContextManagerMock
            .setup(t =>
                t.interpretMessageForTab(
                    2,
                    It.isValue({
                        tabId: 2,
                        messageType: Messages.DevTools.Opened,
                    }),
                ),
            )
            .verifiable(Times.once());

        devToolsMonitorMock.setup(d => d.startMonitoringDevtool(2)).verifiable(Times.once());

        testSubject.initialize();
        connectListenerCB(portStub);

        messageListenerCB({ tabId: 2 }, null);

        browserAdapterMock.verifyAll();
        onMessagePortMock.verify();
        onDisconnectPortMock.verify();

        expect(portStub.targetPageTabId).toBe(2);
        tabContextManagerMock.verifyAll();

        devToolsMonitorMock.verifyAll();
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

        tabContextManagerMock
            .setup(t =>
                t.interpretMessageForTab(
                    2,
                    It.isValue({
                        tabId: 2,
                        messageType: Messages.DevTools.Closed,
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

        tabContextManagerMock.verifyAll();
    });
});
