// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { DevToolStoreData } from 'common/types/store-data/dev-tool-store-data';
import { InspectHandler } from 'Devtools/inspect-handler';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { IMock, Mock, Times } from 'typemoq';
import { DevToolsBrowserAdapterMock } from '../../mock-helpers/dev-tools-chrome-adapter-mock';
import { StoreMock } from '../../mock-helpers/store-mock';

describe(InspectHandler, () => {
    let testSubject: InspectHandler;
    let browserAdapterMock: DevToolsBrowserAdapterMock;
    let devtoolsStoreProxyMock: StoreMock<DevToolStoreData>;
    let targetPageInspectorMock: IMock<TargetPageInspector>;
    const inspectedWindowId = 12;

    beforeEach(() => {
        browserAdapterMock = new DevToolsBrowserAdapterMock();
        devtoolsStoreProxyMock = new StoreMock<DevToolStoreData>();
        targetPageInspectorMock = Mock.ofType<TargetPageInspector>();
        testSubject = new InspectHandler(
            devtoolsStoreProxyMock.getObject(),
            browserAdapterMock.getObject(),
            targetPageInspectorMock.object,
        );
    });

    test('initialize - send about dev tools open message to background ', async () => {
        devtoolsStoreProxyMock.setupAddChangedListener();
        setupDevtoolOpenedMessage();

        await testSubject.initialize();

        devtoolsStoreProxyMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    test('initialize - do not throw when state is null', async () => {
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(null);
        setupDevtoolOpenedMessage();
        await testSubject.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    test('initialize - do not throw when inspectElement is not set', async () => {
        const state = {
            inspectElement: null,
        } as DevToolStoreData;

        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        setupDevtoolOpenedMessage();
        await testSubject.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    test('initialize - inspect on state change: target at parent level', async () => {
        const state = {
            inspectElement: ['#testElement'],
            frameUrl: null,
        } as DevToolStoreData;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        setupDevtoolOpenedMessage();

        targetPageInspectorMock
            .setup(inspector => inspector.inspectElement('#testElement', undefined))
            .verifiable(Times.once());

        await testSubject.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        targetPageInspectorMock.verifyAll();
    });

    test('initialize - inspect on state change: target not at parent level with frame url provided', async () => {
        const state = {
            inspectElement: ['#testElement', 'test'],
            frameUrl: 'testUrl',
        } as DevToolStoreData;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        setupDevtoolOpenedMessage();

        targetPageInspectorMock
            .setup(inspector => inspector.inspectElement('test', 'testUrl'))
            .verifiable(Times.once());

        await testSubject.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        targetPageInspectorMock.verifyAll();
    });

    test("initialize - don't inspect if inspect element length > 1 and frame Url not set", async () => {
        const state = {
            inspectElement: ['#testElement', 'test'],
            frameUrl: null,
        } as DevToolStoreData;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        setupDevtoolOpenedMessage();

        await testSubject.initialize();
        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    function setupDevtoolOpenedMessage(): void {
        browserAdapterMock.setupSendMessageToFrames({
            messageType: Messages.DevTools.Opened,
            tabId: inspectedWindowId,
        });
        browserAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);
    }
});
