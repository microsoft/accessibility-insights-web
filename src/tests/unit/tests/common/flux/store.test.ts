// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { Store } from '../../../../../common/flux/store';
import { IsSameObject } from '../../../common/typemoq-helper';

describe('StoreTest', () => {
    describe('SyncStore', () => {
        let testObject: TestableStore<void>;
        let handlerMock: IMock<(store: TestableStore<void>, args: any) => void>;

        beforeEach(() => {
            handlerMock = Mock.ofInstance((store, args) => {});
            testObject = new TestableStore<void>();
        });

        test('addChangedListener', () => {
            handlerMock
                .setup(h => h(IsSameObject(testObject), It.isAny()))
                .verifiable(Times.once());

            testObject.addChangedListener(handlerMock.object);

            testObject.emitChanged();

            handlerMock.verifyAll();
        });

        test('removeChangedListener', () => {
            handlerMock
                .setup(h => h(IsSameObject(testObject), It.isAny()))
                .verifiable(Times.once());

            testObject.addChangedListener(handlerMock.object);

            testObject.emitChanged();

            handlerMock.verifyAll();

            handlerMock.reset();

            handlerMock.setup(h => h(It.isAny(), It.isAny())).verifiable(Times.never());

            testObject.removeChangedListener(handlerMock.object);

            testObject.emitChanged();

            handlerMock.verifyAll();
        });
    });

    describe('AsyncStore', () => {
        let testObject: TestableStore<Promise<void>>;
        let handlerMock: IMock<(store: TestableStore<Promise<void>>, args: any) => Promise<void>>;

        beforeEach(() => {
            handlerMock = Mock.ofInstance((store, args) => Promise.resolve());
            testObject = new TestableStore<Promise<void>>();
        });

        test('emitChanged returns a promise', async () => {
            handlerMock
                .setup(h => h(IsSameObject(testObject), It.isAny()))
                .returns(h => Promise.resolve())
                .verifiable(Times.once());

            testObject.addChangedListener(handlerMock.object);

            const result = testObject.emitChanged();
            await expect(result).resolves.toBeUndefined();

            handlerMock.verifyAll();
        });
    });

    class TestableStore<TReturn extends void | Promise<void>> extends Store<TReturn> {
        constructor() {
            super();
        }
        public override emitChanged(): TReturn {
            return super.emitChanged();
        }
    }
});
