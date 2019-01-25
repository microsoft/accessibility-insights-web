// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Times } from 'typemoq';

export class ChromeEventMock {
    protected _eventMock: IMock<chrome.events.Event<any>>;

    constructor(eventMock: IMock<chrome.events.Event<any>>) {
        this._eventMock = eventMock;
    }

    public setupAddListenerMock(callback?: (onAddListener: Function) => void): ChromeEventMock {
        this._eventMock
            .setup(x => x.addListener(It.isAny()))
            .returns(cb => {
                if (callback) {
                    callback(cb);
                }
            })
            .verifiable(Times.once());
        return this;
    }

    public setupRemoveListener(): ChromeEventMock {
        this._eventMock.setup(x => x.removeListener(It.isAny())).verifiable(Times.once());

        return this;
    }

    public verify() {
        this._eventMock.verifyAll();
    }

    public getObject(): chrome.events.Event<any> {
        return this._eventMock.object;
    }
}
