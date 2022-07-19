// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionListener } from 'common/flux/action';
import { ScopeMutex } from 'common/flux/scope-mutex';
import { SyncAction } from 'common/flux/sync-action';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(SyncAction, () => {
    let listenerMock: IMock<ActionListener<TestPayload, void>>;
    const testPayload: TestPayload = { key: 'value' };
    let testObject: SyncAction<TestPayload>;
    let scopeMutexMock: IMock<ScopeMutex>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(payload => {}, MockBehavior.Strict);
        scopeMutexMock = Mock.ofType<ScopeMutex>();

        testObject = new SyncAction<TestPayload>(scopeMutexMock.object);
    });

    afterEach(() => {
        listenerMock.verifyAll();
        scopeMutexMock.verifyAll();
    });

    test('addListener and invoke', () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        testObject.invoke(testPayload);
    });

    test('addListener and invoke with scope', () => {
        const scope = 'test_scope';
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(scope)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(scope)).verifiable();

        testObject.invoke(testPayload, scope);
    });

    test('invoke calls all registered listeners', () => {
        const listenerMocks: IMock<(payload: TestPayload) => void>[] = [
            Mock.ofInstance((payload: TestPayload) => {}, MockBehavior.Strict),
            Mock.ofInstance((payload: TestPayload) => {}, MockBehavior.Strict),
            Mock.ofInstance((payload: TestPayload) => {}, MockBehavior.Strict),
        ];

        listenerMocks.forEach(mock => {
            mock.setup(l => l(testPayload)).verifiable(Times.once());
            testObject.addListener(mock.object);
        });

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        testObject.invoke(testPayload);

        listenerMocks.forEach(mock => mock.verifyAll());
    });

    test('addListener and invoke when listener throws error', () => {
        const testError = new Error('test error');
        listenerMock
            .setup(l => l(testPayload))
            .throws(testError)
            .verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        expect(() => testObject.invoke(testPayload)).toThrow(testError);
    });
});

interface TestPayload {
    key: string;
}
