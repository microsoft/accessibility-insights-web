// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromeEventMock } from './chrome-event-mock';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { PortDisconnectStub } from '../Stubs/chrome-adapter-stub';

export class PortOnDisconnectMock extends ChromeEventMock {
    private _portOnDisconnectMock = Mock.ofType(PortDisconnectStub, MockBehavior.Strict);

    constructor() {
        super(Mock.ofType(PortDisconnectStub, MockBehavior.Strict));
        this._portOnDisconnectMock = this._eventMock as IMock<PortDisconnectStub>;
    }

    public setupAddListenerMock(callback?: (onAddListener: (msg: any, port: chrome.runtime.Port) => void) => void): ChromeEventMock {
        return super.setupAddListenerMock(callback) as PortOnDisconnectMock;
    }

    public getObject(): PortDisconnectStub {
        return this._portOnDisconnectMock.object;
    }
}
