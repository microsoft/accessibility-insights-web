// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';
import { StoresTree, StoresTreeProps, StoresTreeState } from 'debug-tools/components/stores-tree';
import { shallow } from 'enzyme';
import * as React from 'react';
import { itIsFunction } from 'tests/unit/common/it-is-function';
import { IMock, Mock, Times } from 'typemoq';

type TestStoreData = {
    value: string;
};

describe('StoresTree', () => {
    let storeMocks: IMock<BaseStore<any>>[];
    let storeActionMessageCreatorMock: IMock<StoreActionMessageCreator>;
    let props: StoresTreeProps;

    beforeEach(() => {
        storeMocks = [
            Mock.ofType<BaseStore<TestStoreData>>(),
            Mock.ofType<BaseStore<TestStoreData>>(),
            Mock.ofType<BaseStore<TestStoreData>>(),
        ];

        storeActionMessageCreatorMock = Mock.ofType<StoreActionMessageCreator>();
    });

    describe('on componentDidMount', () => {
        beforeEach(() => {
            props = {
                global: storeMocks.map(mock => mock.object),
                storeActionMessageCreator: storeActionMessageCreatorMock.object,
            };
        });

        it('should add listeners to the stores', () => {
            shallow(<StoresTree {...props} />);

            storeMocks.forEach(mock => mock.verify(store => store.addChangedListener(itIsFunction), Times.once()));
        });

        it('should call to get all the states', () => {
            shallow(<StoresTree {...props} />);

            storeActionMessageCreatorMock.verify(creator => creator.getAllStates(), Times.once());
        });
    });

    describe('renders', () => {
        it('with NO global state', () => {
            const wrapped = shallow(<StoresTree {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('with global state', () => {
            props = {
                global: storeMocks.map(mock => mock.object),
                storeActionMessageCreator: storeActionMessageCreatorMock.object,
            };

            const wrapped = shallow<StoresTreeProps, StoresTreeState>(<StoresTree {...props} />);

            wrapped.setState({ global: { first: '1', second: '2' } });
            wrapped.update();

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    it('handles store updates by updating the state', () => {
        const storeMock = Mock.ofType<BaseStore<TestStoreData>>();

        let storeListener: Function;

        storeMock.setup(store => store.addChangedListener(itIsFunction)).callback(listener => (storeListener = listener));

        storeMock.setup(store => store.getId()).returns(() => 'test-store-id');
        storeMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    value: '1',
                };
            });

        props = {
            global: [storeMock.object],
            storeActionMessageCreator: storeActionMessageCreatorMock.object,
        };

        const wrapped = shallow<StoresTreeProps, StoresTreeState>(<StoresTree {...props} />);

        expect(wrapped.instance().state).toMatchSnapshot('before update');

        storeListener();

        expect(wrapped.instance().state).toMatchSnapshot('after update');
    });
});
