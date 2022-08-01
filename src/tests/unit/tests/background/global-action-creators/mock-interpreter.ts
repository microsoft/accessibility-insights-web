// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Interpreter } from 'background/interpreter';
import { PayloadCallback } from 'common/message';
import { IMock, It, Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

export class MockInterpreter {
    private internalMock: IMock<Interpreter>;
    private messageCallbacksMap: DictionaryStringTo<PayloadCallback<unknown>>;

    constructor() {
        this.messageCallbacksMap = {};
        this.internalMock = Mock.ofType<Interpreter>();

        this.internalMock
            .setup(interpreter => interpreter.registerTypeToPayloadCallback(It.isAny(), It.isAny()))
            .callback((message, handler) => {
                this.messageCallbacksMap[message] = handler;
            });
    }

    public get object(): Interpreter {
        return this.internalMock.object;
    }

    public simulateMessage(
        messageType: string,
        payload: unknown,
        tabId?: number,
    ): void | Promise<void> {
        const callback = this.messageCallbacksMap[messageType];
        if (callback == null) {
            throw new Error(`No callback was registered for message ${messageType}`);
        }

        return callback(payload, tabId);
    }
}
