// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';

import { ConnectionNames } from '../../../../common/constants/connection-names';
import { DevToolState } from '../../../../common/types/store-data/idev-tool-state';
import { InspectHandler } from '../../../../Devtools/inspect-handler';
import { DevToolsChromeAdapterMock } from '../../mock-helpers/dev-tools-chrome-adapter-mock';
import { StoreMock } from '../../mock-helpers/store-mock';
import { PortStub } from '../../stubs/port-stub';

describe('InspectHandlerTests', () => {
    let testObjec: InspectHandler;
    let devToolsChromeAdapterMock: DevToolsChromeAdapterMock;
    let devtoolsStoreProxyMock: StoreMock<DevToolState>;
    let backgrountConnectionMock: IMock<chrome.runtime.Port>;
    const inspectedWindowId = 12;

    beforeEach(() => {
        devToolsChromeAdapterMock = new DevToolsChromeAdapterMock();
        devtoolsStoreProxyMock = new StoreMock<DevToolState>();
        backgrountConnectionMock = Mock.ofType(PortStub);
        testObjec = new InspectHandler(devtoolsStoreProxyMock.getObject(), devToolsChromeAdapterMock.getObject());

        devToolsChromeAdapterMock.setUpConnect(ConnectionNames.devTools, backgrountConnectionMock.object);
    });

    test('initialize - send about dev tools open message to background ', () => {
        devtoolsStoreProxyMock.setupAddChangedListener();
        backgrountConnectionMock.setup(x => x.postMessage(It.isObjectWith({ tabId: inspectedWindowId }))).verifiable();
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);

        testObjec.initialize();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
        backgrountConnectionMock.verifyAll();
    });

    test('initialize - do not throw when state is null', () => {
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(null);
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);
        testObjec.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
    });

    test('initialize - do not throw when inspectElement is not set', () => {
        const state = {
            inspectElement: null,
        } as DevToolState;

        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);
        testObjec.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
    });

    test('initialize - inspect on state change: target at parent level', () => {
        const state = {
            inspectElement: ['#testElement'],
            frameUrl: null,
        } as DevToolState;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);

        devToolsChromeAdapterMock.setupExecuteScriptInInspectedWindow("inspect(document.querySelector('#testElement'))", null);
        testObjec.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
    });

    test('initialize - inspect on state change: target not at parent level with frame url provided', () => {
        const state = {
            inspectElement: ['#testElement', 'test'],
            frameUrl: 'testUrl',
        } as DevToolState;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);

        devToolsChromeAdapterMock.setupExecuteScriptInInspectedWindow("inspect(document.querySelector('test'))", 'testUrl');
        testObjec.initialize();

        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
    });

    test("initialize - don't inspect if inspect element length > 1 and frame Url not set", () => {
        const state = {
            inspectElement: ['#testElement', 'test'],
            frameUrl: null,
        } as DevToolState;
        devtoolsStoreProxyMock.setupAddChangedListener();
        devtoolsStoreProxyMock.setupGetState(state);
        devToolsChromeAdapterMock.setupGetInspectedWindowTabId(inspectedWindowId);

        testObjec.initialize();
        devtoolsStoreProxyMock.invokeChangeListener();

        devtoolsStoreProxyMock.verifyAll();
        devToolsChromeAdapterMock.verifyAll();
    });
});
