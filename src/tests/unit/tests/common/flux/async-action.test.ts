// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { ScopeMutex } from 'common/flux/scope-mutex';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(AsyncAction, () => {
    let listenerMock: IMock<(payload: TestPayload) => Promise<void>>;
    const testPayload: TestPayload = { key: 'value' };
    let testObject: AsyncAction<TestPayload>;
    let scopeMutexMock: IMock<ScopeMutex>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict);
        scopeMutexMock = Mock.ofType<ScopeMutex>();

        testObject = new AsyncAction<TestPayload>(scopeMutexMock.object);
    });

    afterEach(() => {
        listenerMock.verifyAll();
        scopeMutexMock.verifyAll();
    });

    test('addListener and invoke', async () => {
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        await testObject.invoke(testPayload);
    });

    test('addListener and invoke with scope', async () => {
        const scope = 'test_scope';
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(scope)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(scope)).verifiable();

        await testObject.invoke(testPayload, scope);
    });

    test('invoke calls all registered listeners', async () => {
        const listenerMocks: IMock<(payload: TestPayload) => Promise<void>>[] = [
            Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict),
            Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict),
            Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict),
        ];

        listenerMocks.forEach(mock => {
            mock.setup(l => l(testPayload)).verifiable(Times.once());
            testObject.addListener(mock.object);
        });

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        await testObject.invoke(testPayload);

        listenerMocks.forEach(mock => mock.verifyAll());
    });

    test('addListener and invoke when listener throws error', async () => {
        const testError = new Error('test error');
        listenerMock
            .setup(l => l(testPayload))
            .returns(() => Promise.reject(testError))
            .verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable();
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable();

        await expect(() => testObject.invoke(testPayload)).rejects.toThrow(testError);
    });
});

interface TestPayload {
    key: string;
}
