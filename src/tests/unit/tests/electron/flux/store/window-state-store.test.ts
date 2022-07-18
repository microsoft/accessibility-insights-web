// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RoutePayload } from 'electron/flux/action/route-payloads';
import { WindowStateActions } from 'electron/flux/action/window-state-actions';
import { WindowStatePayload } from 'electron/flux/action/window-state-payload';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('WindowStateStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const testSubject = createStoreWithNullParams(WindowStateStore);
            expect(testSubject).toBeDefined();
        });
    });

    it('returns device connect as the default state', () => {
        const testSubject = new WindowStateStore(new WindowStateActions());
        testSubject.initialize();

        expect(testSubject.getState()).toMatchSnapshot();
    });

    it('changes route id from default to resultsView', async () => {
        const payload: RoutePayload = {
            routeId: 'resultsView',
        };
        const expectedState: WindowStateStoreData = {
            routeId: payload.routeId,
            currentWindowState: 'customSize',
        };

        const initialState = createStoreWithNullParams(WindowStateStore).getDefaultState();

        const storeTester =
            createStoreTesterForWindowStateActions('setRoute').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    it('does not emit a change when the route is not changing', async () => {
        const payload: RoutePayload = {
            routeId: 'deviceConnectView',
        };
        const expectedState: WindowStateStoreData = {
            routeId: payload.routeId,
            currentWindowState: 'customSize',
        };

        const initialState = createStoreWithNullParams(WindowStateStore).getDefaultState();

        const storeTester =
            createStoreTesterForWindowStateActions('setRoute').withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    it('does not emit a change when the window state is not changing', async () => {
        const payload: WindowStatePayload = {
            currentWindowState: 'customSize',
        };
        const expectedState: WindowStateStoreData = {
            routeId: 'deviceConnectView',
            currentWindowState: 'customSize',
        };

        const initialState = createStoreWithNullParams(WindowStateStore).getDefaultState();

        const storeTester =
            createStoreTesterForWindowStateActions('setWindowState').withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    it('changes currentWindowState from default to maximized', async () => {
        const payload: WindowStatePayload = {
            currentWindowState: 'maximized',
        };
        const expectedState: WindowStateStoreData = {
            routeId: 'deviceConnectView',
            currentWindowState: payload.currentWindowState,
        };

        const initialState = createStoreWithNullParams(WindowStateStore).getDefaultState();

        const storeTester =
            createStoreTesterForWindowStateActions('setWindowState').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForWindowStateActions(
        actionName: keyof WindowStateActions,
    ): StoreTester<WindowStateStoreData, WindowStateActions> {
        const factory = (actions: WindowStateActions) => new WindowStateStore(actions);

        return new StoreTester(WindowStateActions, actionName, factory);
    }
});
