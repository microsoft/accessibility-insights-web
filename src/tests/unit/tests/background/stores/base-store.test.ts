// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { StoreNames } from '../../../../../common/stores/store-names';
import { IsSameObject } from '../../../common/typemoq-helper';

describe('BaseStoreTest', () => {
    test('getId', () => {
        const testObject = new TestStore(null);

        expect(testObject.getId()).toEqual(StoreNames[0]);
    });

    test('getState (with default state)', () => {
        const addActionListenerMock = Mock.ofInstance(() => {});
        const testObject = new TestStore(addActionListenerMock.object);
        testObject.initialize();

        const expected: TestData = testObject.getDefaultState();

        expect(testObject.getState()).toEqual(expected);
    });

    test('getState (with custom state)', () => {
        const addActionListenerMock = Mock.ofInstance(() => {});
        const customState: TestData = {
            value: 'custom-value',
        };

        const testObject = new TestStore(addActionListenerMock.object);
        testObject.initialize(customState);

        expect(testObject.getState()).toEqual(customState);
    });

    test('initialize (calling addActionListeners)', () => {
        const addActionListenerMock = Mock.ofInstance(() => {}, MockBehavior.Strict);
        addActionListenerMock.setup(listener => listener()).verifiable(Times.once());
        const testObject = new TestStore(addActionListenerMock.object);

        testObject.initialize();

        addActionListenerMock.verifyAll();
    });

    test('onGetCurrentState', () => {
        const changedListener = Mock.ofInstance((testStore: TestStore, args: any) => {},
        MockBehavior.Strict);

        const listenerAdder = function (): void {
            // hack to access onGetCurrentState from the BaseStore class
            // tslint:disable-next-line:no-invalid-this
            this.onGetCurrentState();
        };

        const testObject = new TestStore(listenerAdder);
        changedListener
            .setup(listener => listener(IsSameObject(testObject), It.isValue(undefined)))
            .verifiable(Times.once());

        testObject.addChangedListener(changedListener.object);
        testObject.initialize();

        changedListener.verifyAll();
    });

    interface TestData {
        value: string;
    }

    class TestStore extends BaseStoreImpl<TestData> {
        private listener: () => void;

        constructor(listener: () => void) {
            super(StoreNames[StoreNames[0]]);

            this.listener = listener;
        }

        protected addActionListeners(): void {
            this.listener();
        }

        public getDefaultState(): TestData {
            const state: TestData = {
                value: 'test-value',
            };

            return state;
        }
    }
});
