// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior } from 'typemoq';
import { PortOnMessageStub } from '../stubs/chrome-adapter-stub';
import { ChromeEventMock } from './chrome-event-mock';

export class PortOnMessageMock extends ChromeEventMock {
    private portOnMessageMock: IMock<PortOnMessageStub>;

    constructor() {
        super(Mock.ofType(PortOnMessageStub, MockBehavior.Strict));
        this.portOnMessageMock = this.eventMock as IMock<PortOnMessageStub>;
    }

    public setupAddListenerMock(
        callback?: (onAddListener: (msg: any, port: chrome.runtime.Port) => void) => void,
    ): PortOnMessageMock {
        return super.setupAddListenerMock(callback) as PortOnMessageMock;
    }

    public getObject(): PortOnMessageStub {
        return this.portOnMessageMock.object;
    }
}
