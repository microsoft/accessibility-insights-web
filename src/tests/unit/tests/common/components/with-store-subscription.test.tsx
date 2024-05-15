// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { act, render } from '@testing-library/react';
import * as React from 'react';
import {
    withStoreSubscription,
    WithStoreSubscriptionProps,
} from '../../../../../common/components/with-store-subscription';
import { ClientStoresHub } from '../../../../../common/stores/client-stores-hub';

describe('withStoreSubscription', () => {
    type testProps = WithStoreSubscriptionProps<{ message: string }>;
    const testComp: React.FC<React.PropsWithChildren<testProps>> = props => (
        <h1>{props.storeState.message}</h1>
    );

    test('constructor: storesHub is null', () => {
        const props: testProps = {
            deps: {
                storesHub: null,
            },
            storeState: null,
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
                storesHub: storesHubStub,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);
        expect(rendered.state).toEqual(storeData);
    });

    test('componentDidMount: deps is null', () => {
        const props: testProps = {
            deps: null,
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();
    });

    test('componentDidMount: store hub is null', () => {
        const props: testProps = {
            deps: {
                storesHub: null,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();
    });

    test('componentDidMount: not all store are loaded', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(false);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.addChangedListenerToAllStores = jest.fn();
        storesHubStub.hasStores = hasStoresMock;
        const props: testProps = {
            deps: {
                storesHub: storesHubStub,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        expect(storesHubStub.addChangedListenerToAllStores).not.toBeCalled();
        expect(hasStoresMock).toBeCalled();
    });

    test('componentDidMount: all store are loaded', () => {
        const hasStoresMock = jest.fn();
        hasStoresMock.mockReturnValue(true);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.addChangedListenerToAllStores = jest.fn();
        storesHubStub.hasStores = hasStoresMock;
        const props: testProps = {
            deps: {
                storesHub: storesHubStub,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();

        expect(hasStoresMock).toBeCalled();
        expect(storesHubStub.addChangedListenerToAllStores).toBeCalled();
    });

    test('componentWillUnmount: storesHub is null', () => {
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = () => null;
        storesHubStub.removeChangedListenerFromAllStores = jest.fn();
        const props: testProps = {
            deps: {
                storesHub: null,
            },
            storeState: null,
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
                storesHub: storesHubStub,
            },
            storeState: null,
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
        const props: testProps = {
            deps: {
                storesHub: storesHubStub,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<testProps, any>(testComp);
        const rendered = new WrappedComp(props);

        rendered.componentDidMount();
        rendered.componentWillUnmount();

        expect(listenerAdded).toBeDefined();
        expect(listenerRemoved).toBeDefined();
        expect(listenerAdded).toEqual(listenerRemoved);
    });

    test('render', async () => {
        let onStoreChange;
        const hasStoresMock = jest.fn();
        const getStoreDataMock = jest.fn();
        const addChangedListenerToAllStoresMock = jest.fn();
        addChangedListenerToAllStoresMock.mockImplementation(cb => {
            onStoreChange = cb;
        });
        const removeChangedListenerFromAllStoresMock = jest.fn();
        removeChangedListenerFromAllStoresMock.mockImplementation(cb => {
            onStoreChange = cb;
        });
        getStoreDataMock
            .mockReturnValueOnce({ message: 'before change' })
            .mockReturnValueOnce({ message: 'after change' });

        hasStoresMock.mockReturnValue(true);
        const storesHubStub: ClientStoresHub<any> = {} as ClientStoresHub<any>;
        storesHubStub.getAllStoreData = getStoreDataMock;
        storesHubStub.addChangedListenerToAllStores = addChangedListenerToAllStoresMock;
        storesHubStub.removeChangedListenerFromAllStores = removeChangedListenerFromAllStoresMock;
        storesHubStub.hasStores = hasStoresMock;
        const props: WithStoreSubscriptionProps<any> = {
            deps: {
                storesHub: storesHubStub,
            },
            storeState: null,
        };
        const WrappedComp = withStoreSubscription<WithStoreSubscriptionProps<any>, any>(testComp);
        const renderResult = render(<WrappedComp {...props} />);

        expect(renderResult.container).toMatchSnapshot('before store change');

        await act(() => onStoreChange());

        expect(renderResult.container).toMatchSnapshot('after store change');
    });
});
