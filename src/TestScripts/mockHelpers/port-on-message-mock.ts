// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromeEventMock } from './chrome-event-mock';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { PortOnMessageStub } from '../Stubs/chrome-adapter-stub';

export class PortOnMessageMock extends ChromeEventMock {

    private _portOnMessageMock: IMock<PortOnMessageStub>;

    constructor() {
        super(Mock.ofType(PortOnMessageStub, MockBehavior.Strict));
        this._portOnMessageMock = this._eventMock as IMock<PortOnMessageStub>;
    }

    public setupAddListenerMock(callback?: (onAddListener: (msg: any, port: chrome.runtime.Port) => void) => void): PortOnMessageMock {
        return super.setupAddListenerMock(callback) as PortOnMessageMock;
    }

    public getObject(): PortOnMessageStub {
        return this._portOnMessageMock.object;
    }
}
