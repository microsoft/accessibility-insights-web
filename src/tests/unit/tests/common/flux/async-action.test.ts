// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionListener } from 'common/flux/action';
import { AsyncAction } from 'common/flux/async-action';
import { ScopeMutex } from 'common/flux/scope-mutex';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(AsyncAction, () => {
    let listenerMock: IMock<ActionListener<TestPayload, Promise<void>>>;
    const testPayload: TestPayload = { key: 'value' };
    let testObject: AsyncAction<TestPayload>;
    let scopeMutexMock: IMock<ScopeMutex>;
    let mergePromisesMock: IMock<(promises: Promise<unknown>[]) => Promise<void>>;
    let mergedPromiseInternalMock: IMock<() => void>;

    beforeEach(() => {
        listenerMock = Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict);
        scopeMutexMock = Mock.ofType<ScopeMutex>();
        mergePromisesMock = Mock.ofInstance(async _ => null);
        mergedPromiseInternalMock = Mock.ofInstance(() => null);

        testObject = new AsyncAction<TestPayload>(scopeMutexMock.object, mergePromisesMock.object);
    });

    afterEach(() => {
        listenerMock.verifyAll();
        scopeMutexMock.verifyAll();
        mergePromisesMock.verifyAll();
        mergedPromiseInternalMock.verifyAll();
    });

    test('addListener and invoke', async () => {
        const listenerPromise = Promise.resolve();
        listenerMock
            .setup(l => l(testPayload))
            .returns(() => listenerPromise)
            .verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        setupScopeMutex();
        setupMergePromises([listenerPromise]);

        await testObject.invoke(testPayload);
    });

    test('addListener and invoke with scope', async () => {
        const scope = 'test_scope';
        const listenerPromise = Promise.resolve();
        listenerMock
            .setup(l => l(testPayload))
            .returns(() => listenerPromise)
            .verifiable(Times.once());

        testObject.addListener(listenerMock.object);

        setupScopeMutex(scope);
        setupMergePromises([listenerPromise]);

        await testObject.invoke(testPayload, scope);
    });

    test('invoke merges all registered listeners', async () => {
        const listenerPromises: Promise<void>[] = [
            Promise.resolve(),
            Promise.resolve(),
            Promise.resolve(),
        ];
        const listenerMocks: IMock<(payload: TestPayload) => Promise<void>>[] =
            listenerPromises.map(listenerPromise => {
                const listenerMock = Mock.ofInstance(_ => Promise.resolve(), MockBehavior.Strict);
                listenerMock
                    .setup(l => l(testPayload))
                    .returns(() => listenerPromise)
                    .verifiable(Times.once());
                testObject.addListener(listenerMock.object);

                return listenerMock;
            });

        setupScopeMutex();
        setupMergePromises(listenerPromises);

        await testObject.invoke(testPayload);

        listenerMocks.forEach(mock => mock.verifyAll());
    });

    test('invoke throws if merged promise throws', async () => {
        const testError = new Error('test error');

        testObject.addListener(() => null);

        setupScopeMutex();
        mergePromisesMock
            .setup(m => m(It.isAny()))
            .returns(() => Promise.reject(testError))
            .verifiable(Times.once());

        await expect(() => testObject.invoke(testPayload)).rejects.toThrow(testError);
    });

    function setupScopeMutex(scope?: string) {
        scopeMutexMock.setup(m => m.tryLockScope(scope)).verifiable(Times.once());
        scopeMutexMock.setup(m => m.unlockScope(scope)).verifiable(Times.once());
    }

    function setupMergePromises(promises: Promise<void>[]) {
        mergedPromiseInternalMock.setup(m => m()).verifiable(Times.once());
        mergePromisesMock
            .setup(m => m(promises))
            .returns(async () => mergedPromiseInternalMock.object())
            .verifiable(Times.once());
    }
});

interface TestPayload {
    key: string;
}
