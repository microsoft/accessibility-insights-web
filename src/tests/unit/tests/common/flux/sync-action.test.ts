// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(SyncAction, () => {
    let listenerMock: IMock<(payload: TestPayload) => void>;
    const testPayload: TestPayload = { key: 'value' };
    let testObject: SyncAction<TestPayload>;
    let nestedObject: SyncAction<TestPayload>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(payload => {}, MockBehavior.Strict);
        testObject = new SyncAction<TestPayload>();
        nestedObject = new SyncAction<TestPayload>();
    });

    afterEach(() => {
        listenerMock.verifyAll();
    });

    test('addListener, invoke', () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        testObject.invoke(testPayload);
    });

    test('nested invokes with default scope should not allow nested call', () => {
        let caughtError = null;

        testObject.addListener(payload => {
            try {
                nestedObject.invoke(payload);
            } catch (error) {
                caughtError = error;
            }
        });

        testObject.invoke(testPayload);

        expect(caughtError).toBeTruthy();
        expect(caughtError.message.includes('DEFAULT_SCOPE')).toBeTruthy();
    });

    test('nested invokes with same non-default scope should not allow nested call', () => {
        const scopeName = 'My Test Scope';
        let caughtError = null;

        testObject.addListener(payload => {
            try {
                nestedObject.invoke(payload, scopeName);
            } catch (error) {
                caughtError = error;
            }
        });

        testObject.invoke(testPayload, scopeName);

        expect(caughtError).toBeTruthy();
        expect(caughtError.message.includes(scopeName)).toBeTruthy();
    });

    test('nested invokes with different scopes should allow nested call', () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(payload => {
            nestedObject.invoke(payload, 'some custom scope');
        });
        nestedObject.addListener(listenerMock.object);
        testObject.invoke(testPayload);
    });
});

interface TestPayload {
    key: string;
}
