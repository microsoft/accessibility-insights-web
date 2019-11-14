// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { Store } from '../../../../../common/flux/store';
import { IsSameObject } from '../../../common/typemoq-helper';

describe('StoreTest', () => {
    let testObject: TestableStore;
    let handlerMock: IMock<(store: TestableStore, args: any) => void>;

    beforeEach(() => {
        handlerMock = Mock.ofInstance((store, args) => {});
        testObject = new TestableStore();
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

        handlerMock
            .setup(h => h(It.isAny(), It.isAny()))
            .verifiable(Times.never());

        testObject.removeChangedListener(handlerMock.object);

        testObject.emitChanged();

        handlerMock.verifyAll();
    });

    class TestableStore extends Store {
        constructor() {
            super();
        }
        public emitChanged(): void {
            super.emitChanged();
        }
    }
});
