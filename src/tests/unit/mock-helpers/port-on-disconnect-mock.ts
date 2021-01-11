// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior } from 'typemoq';
import { PortDisconnectStub } from '../stubs/chrome-adapter-stub';
import { ChromeEventMock } from './chrome-event-mock';

export class PortOnDisconnectMock extends ChromeEventMock {
    private portOnDisconnectMock = Mock.ofType(PortDisconnectStub, MockBehavior.Strict);

    constructor() {
        super(Mock.ofType(PortDisconnectStub, MockBehavior.Strict));
        this.portOnDisconnectMock = this.eventMock as IMock<PortDisconnectStub>;
    }

    public setupAddListenerMock(
        callback?: (onAddListener: (msg: any, port: chrome.runtime.Port) => void) => void,
    ): ChromeEventMock {
        return super.setupAddListenerMock(callback) as PortOnDisconnectMock;
    }

    public getObject(): PortDisconnectStub {
        return this.portOnDisconnectMock.object;
    }
}
