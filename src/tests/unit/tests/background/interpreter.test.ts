// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Mock, Times } from 'typemoq';
import { PayloadCallback } from '../../../../common/message';
import { DictionaryStringTo } from '../../../../types/common-types';

class TestableInterpreter extends Interpreter {
    public getMessageToActionMapping(): DictionaryStringTo<PayloadCallback<any>> {
        return this.messageToActionMapping;
    }

    public setMessageToActionMapping(messageToActionMapping: DictionaryStringTo<PayloadCallback<any>>): void {
        this.messageToActionMapping = messageToActionMapping;
    }
}

describe('InterpreterTest', () => {
    test('registerTypeToPayloadCallback', () => {
        const testSubject = new TestableInterpreter();
        const sampleCallback = () => {};
        testSubject.registerTypeToPayloadCallback('test', sampleCallback);
        expect(testSubject.getMessageToActionMapping()).toEqual({ test: sampleCallback });
    });

    test('interpret', () => {
        const testSubject = new TestableInterpreter();
        const sampleCallback = Mock.ofInstance((payload, tabId) => {});
        testSubject.setMessageToActionMapping({ test: sampleCallback.object });

        sampleCallback.setup(x => x('payload', 1)).verifiable();

        expect(
            testSubject.interpret({
                messageType: 'test',
                tabId: 1,
                payload: 'payload',
            }),
        ).toBeTruthy();

        sampleCallback.verifyAll();
    });

    test('interpret should not throw if action doesnt exist', () => {
        const testSubject = new TestableInterpreter();
        const sampleCallback = Mock.ofInstance((payload, tabId) => {});
        testSubject.setMessageToActionMapping({ test: sampleCallback.object });

        sampleCallback.setup(x => x('payload', 1)).verifiable(Times.never());

        expect(
            testSubject.interpret({
                messageType: 'test2',
                tabId: 1,
                payload: 'payload',
            }),
        ).toBeFalsy();

        sampleCallback.verifyAll();
    });
});
