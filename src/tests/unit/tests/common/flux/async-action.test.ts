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

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable(Times.once());

        await testObject.invoke(testPayload);
    });

    test('addListener and invoke with scope', async () => {
        const scope = 'test_scope';
        listenerMock.setup(l => l(testPayload)).verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(scope)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(scope)).verifiable(Times.once());

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

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable(Times.once());

        await testObject.invoke(testPayload);

        listenerMocks.forEach(mock => mock.verifyAll());
    });

    test('invoke throws if a listener throws error', async () => {
        const testError = new Error('test error');
        listenerMock
            .setup(l => l(testPayload))
            .returns(async () => {
                throw testError;
            })
            .verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable(Times.once());

        await expect(() => testObject.invoke(testPayload)).rejects.toThrow(testError);
    });

    test('invoke aggregates errors if multiple listeners throw', async () => {
        const testErrors: Error[] = [];
        const listenerMocks: IMock<(payload: TestPayload) => Promise<void>>[] = [
            Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict),
            Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict),
        ];
        listenerMocks.forEach(mock => {
            const testError = new Error('test error');
            testErrors.push(testError);
            mock.setup(l => l(testPayload))
                .returns(async () => {
                    throw testError;
                })
                .verifiable(Times.once());
            testObject.addListener(mock.object);
        });

        scopeMutexMock.setup(m => m.tryLockScope(undefined)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(undefined)).verifiable(Times.once());

        try {
            await testObject.invoke(testPayload);
            fail('Expected invoke to throw error');
        } catch (e) {
            expect(e).toBeInstanceOf(AggregateError);

            listenerMocks.forEach(mock => mock.verifyAll());

            const aggregateError = e as AggregateError;
            expect(aggregateError.errors.length).toBe(testErrors.length);
            testErrors.forEach(error => {
                expect(aggregateError.errors).toContain(error);
            });
        }
    });
});

interface TestPayload {
    key: string;
}
