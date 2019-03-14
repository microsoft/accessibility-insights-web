// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DevToolsChromeAdapter, IDevToolsChromeAdapter } from '../../../background/dev-tools-chrome-adapter';
import { PortWithTabId } from '../../../background/dev-tools-listener';
import { PortDisconnectStub, PortOnMessageStub } from '../stubs/chrome-adapter-stub';
import { PortStub } from '../stubs/port-stub';

export class PortWithTabTabIdStub extends PortStub implements PortWithTabId {
    constructor(name: string, onMessagePort: PortOnMessageStub, onDisconnectPort: PortDisconnectStub) {
        super();
        this.name = name;
        this.onMessage = onMessagePort;
        this.onDisconnect = onDisconnectPort;
    }

    public targetPageTabId: number = 0;
}

export class ChromeAdapterMock {
    private _chromeAdapterMock: IMock<IDevToolsChromeAdapter> = Mock.ofType(DevToolsChromeAdapter, MockBehavior.Strict);

    public setUpAddListenerOnConnect(
        callback?: (onListenerConnect: (port: PortWithTabTabIdStub) => void) => void,
        times: number = 1,
    ): ChromeAdapterMock {
        this._chromeAdapterMock
            .setup(x => x.addListenerOnConnect(It.isAny()))
            .callback(cb => {
                if (callback) {
                    callback(cb);
                }
            })
            .verifiable(Times.exactly(times));

        return this;
    }

    public setUpConnect(name: string, onConnectPort: chrome.runtime.Port): ChromeAdapterMock {
        this._chromeAdapterMock
            .setup(x => x.connect(It.isObjectWith({ name: name })))
            .returns(() => onConnectPort)
            .verifiable(Times.once());

        return this;
    }

    public setupGetInspectedWindowTabId(tabId: number): ChromeAdapterMock {
        this._chromeAdapterMock
            .setup(x => x.getInspectedWindowTabId())
            .returns(() => tabId)
            .verifiable(Times.once());

        return this;
    }

    public setupExecuteScriptInInspectedWindow(script: string, frameUrl: string): ChromeAdapterMock {
        this._chromeAdapterMock.setup(x => x.executeScriptInInspectedWindow(It.isValue(script), frameUrl)).verifiable(Times.once());

        return this;
    }

    public verifyAll(): void {
        this._chromeAdapterMock.verifyAll();
    }

    public getObject(): IDevToolsChromeAdapter {
        return this._chromeAdapterMock.object;
    }
}
