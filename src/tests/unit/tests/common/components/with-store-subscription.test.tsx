// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { withStoreSubscription, WithStoreSubscriptionProps } from '../../../../../common/components/with-store-subscription';
import { StoreActionMessageCreatorImpl } from '../../../../../common/message-creators/store-action-message-creator-impl';
import { ClientStoresHub } from '../../../../../common/stores/client-stores-hub';

describe('withStoreSubscription', () => {
    type testProps = WithStoreSubscriptionProps<{ message: string }>;
    const testComp: React.SFC<testProps> = props => <h1>{props.storeState.message}</h1>;
    let storeActionCreatorMock: IMock<StoreActionMessageCreatorImpl>;

    beforeEach(() => {
        storeActionCreatorMock = Mock.ofType(StoreActionMessageCreatorImpl);
    });

    test('constructor: storesHub is null', () => {
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: null,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);
        expect(rendered.state).toEqual({});
    });

    test('constructor: set the state using data returned from storesHub', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(true);
        const storeData = { message: 'This is the store data' };
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => storeData;
        storesHubStub.hasStores = hasStoresMock;

        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);
        expect(rendered.state).toEqual(storeData);
    });

    test('componentDidMount: deps is null', () => {
        storeActionCreatorMock.setup(d => d.getAllStates()).verifiable(Times.never());
        const props: testProps = {
            deps: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        storeActionCreatorMock.verifyAll();
    });

    test('componentDidMount: store hub is null', () => {
        storeActionCreatorMock.setup(d => d.getAllStates()).verifiable(Times.never());
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: null,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        storeActionCreatorMock.verifyAll();
    });

    test('componentDidMount: not all store are loaded', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(false);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.addChangedListenerToAllStores = jest.fn();
        storesHubStub.hasStores = hasStoresMock;
        storeActionCreatorMock.setup(d => d.getAllStates()).verifiable(Times.never());
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        expect(storesHubStub.addChangedListenerToAllStores).not.toBeCalled();
        expect(hasStoresMock).toBeCalled();
        storeActionCreatorMock.verifyAll();
    });

    test('componentDidMount: all store are loaded', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(true);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.addChangedListenerToAllStores = jest.fn();
        storesHubStub.hasStores = hasStoresMock;
        storeActionCreatorMock.setup(d => d.getAllStates()).verifiable(Times.once());
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        expect(hasStoresMock).toBeCalled();
        expect(storesHubStub.addChangedListenerToAllStores).toBeCalled();
        storeActionCreatorMock.verifyAll();
    });

    test('componentWillUnmount: storesHub is null', () => {
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.removeChangedListenerFromAllStores = jest.fn();
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: null,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentWillUnmount();

        expect(storesHubStub.removeChangedListenerFromAllStores).not.toBeCalled();
    });

    test('componentWillUnmount', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(true);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.hasStores = hasStoresMock;
        storesHubStub.removeChangedListenerFromAllStores = jest.fn();
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentWillUnmount();

        expect(storesHubStub.removeChangedListenerFromAllStores).toBeCalled();
    });

    test('removeListener is called with the same listener as addListener was called with', () => {
        const hasStoresMock = jest.fn();
        const addListenerMock = jest.fn();
        const removeListenerMock = jest.fn();
        let listenerAdded;
        let listenerRemoved;
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        hasStoresMock.mockReturnValue(true);
        storesHubStub.getAllStoreData = () => null;
        addListenerMock.mockImplementation(cb => (listenerAdded = cb));
        removeListenerMock.mockImplementation(cb => (listenerRemoved = cb));
        storesHubStub.addChangedListenerToAllStores = addListenerMock;
        storesHubStub.removeChangedListenerFromAllStores = removeListenerMock;
        storesHubStub.hasStores = hasStoresMock;
        storeActionCreatorMock.setup(d => d.getAllStates()).verifiable(Times.once());
        const props: testProps = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();
        rendered.componentWillUnmount();

        expect(listenerAdded).toBeDefined();
        expect(listenerRemoved).toBeDefined();
        expect(listenerAdded).toEqual(listenerRemoved);
    });

    test('render', () => {
        let onStoreChange;
        const hasStoresMock = jest.fn();
        const getStoreDataMock = jest.fn();
        const addChangedListenerToAllStoresMock = jest.fn();
        addChangedListenerToAllStoresMock.mockImplementation(cb => {
            onStoreChange = cb;
        });
        getStoreDataMock.mockReturnValueOnce({ message: 'before change' }).mockReturnValueOnce({ message: 'after change' });

        hasStoresMock.mockReturnValue(true);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = getStoreDataMock;
        storesHubStub.addChangedListenerToAllStores = addChangedListenerToAllStoresMock;
        storesHubStub.hasStores = hasStoresMock;
        const props: WithStoreSubscriptionProps<any> = {
            deps: {
                storeActionMessageCreator: storeActionCreatorMock.object,
                storesHub: storesHubStub,
            },
        };
        const WrappedComp = withStoreSubscription<WithStoreSubscriptionProps<any>, any>(testComp);
        const rendered = shallow(<WrappedComp {...props} />);

        expect(rendered.dive().getElement()).toMatchSnapshot('before store change');

        onStoreChange();

        expect(rendered.dive().getElement()).toMatchSnapshot('after store change');
    });
});
