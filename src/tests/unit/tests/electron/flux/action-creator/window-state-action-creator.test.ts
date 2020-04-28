// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { Action } from 'common/flux/action';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { RoutePayload } from 'electron/flux/action/route-payloads';
import { WindowStateActions } from 'electron/flux/action/window-state-actions';
import { WindowStatePayload } from 'electron/flux/action/window-state-payload';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(WindowStateActionCreator, () => {
    let windowStateActionsMock: IMock<WindowStateActions>;
    let windowFrameActionCreatorMock: IMock<WindowFrameActionCreator>;
    let userConfigurationStoreMock: IMock<UserConfigurationStore>;
    let testSubject: WindowStateActionCreator;

    beforeEach(() => {
        windowStateActionsMock = Mock.ofType<WindowStateActions>();
        windowFrameActionCreatorMock = Mock.ofType<WindowFrameActionCreator>(
            WindowFrameActionCreator,
            MockBehavior.Strict,
        );
        userConfigurationStoreMock = Mock.ofType<UserConfigurationStore>();

        testSubject = new WindowStateActionCreator(
            windowStateActionsMock.object,
            windowFrameActionCreatorMock.object,
            userConfigurationStoreMock.object,
        );
    });

    it('calling setRoute invokes setRoute action with given payload', () => {
        const setRouteActionMock = Mock.ofType<Action<RoutePayload>>();
        const testPayload: RoutePayload = {
            routeId: 'resultsView',
        };
        const userConfigStoreDataStub = {
            lastWindowSize: null,
        } as UserConfigurationStoreData;

        windowStateActionsMock
            .setup(actions => actions.setRoute)
            .returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());
        userConfigurationStoreMock.setup(u => u.getState()).returns(() => userConfigStoreDataStub);
        windowFrameActionCreatorMock.setup(w => w.maximize());

        testSubject.setRoute(testPayload);

        setRouteActionMock.verifyAll();
    });

    it('calling setRoute with deviceConnectView, invokes setWindowSize', () => {
        const setRouteActionMock = Mock.ofType<Action<RoutePayload>>();
        const testPayload: RoutePayload = {
            routeId: 'deviceConnectView',
        };

        windowFrameActionCreatorMock
            .setup(w => w.setWindowSize({ width: 600, height: 391 }))
            .verifiable(Times.once());

        windowStateActionsMock
            .setup(actions => actions.setRoute)
            .returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setRoute(testPayload);

        setRouteActionMock.verifyAll();
        windowFrameActionCreatorMock.verifyAll();
    });

    it('calling setRoute with view other than deviceConnectView sets window size from last saved window size', () => {
        const setRouteActionMock = Mock.ofType<Action<RoutePayload>>();
        const testPayload: RoutePayload = {
            routeId: 'resultsView',
        };
        const userConfigStoreDataStub = {
            lastWindowSize: { width: 600, height: 400 },
        } as UserConfigurationStoreData;

        userConfigurationStoreMock.setup(u => u.getState()).returns(() => userConfigStoreDataStub);

        windowFrameActionCreatorMock
            .setup(w => w.setWindowSize(userConfigStoreDataStub.lastWindowSize))
            .verifiable(Times.once());

        windowStateActionsMock
            .setup(actions => actions.setRoute)
            .returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setRoute(testPayload);

        setRouteActionMock.verifyAll();
        windowFrameActionCreatorMock.verifyAll();
    });

    it('calling setRoute with view other than deviceConnectView maximizes window when lastWindowSize is null', () => {
        const setRouteActionMock = Mock.ofType<Action<RoutePayload>>();
        const testPayload: RoutePayload = {
            routeId: 'resultsView',
        };
        const userConfigStoreDataStub = {
            lastWindowSize: null,
        } as UserConfigurationStoreData;

        userConfigurationStoreMock.setup(u => u.getState()).returns(() => userConfigStoreDataStub);

        windowFrameActionCreatorMock.setup(w => w.maximize()).verifiable(Times.once());

        windowStateActionsMock
            .setup(actions => actions.setRoute)
            .returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setRoute(testPayload);

        setRouteActionMock.verifyAll();
        windowFrameActionCreatorMock.verifyAll();
    });

    it('calling setWindowState invokes setWindowState action', () => {
        const setWindowStatePayload = Mock.ofType<Action<WindowStatePayload>>();
        const testPayload: WindowStatePayload = {
            currentWindowState: 'maximized',
        };

        windowStateActionsMock
            .setup(actions => actions.setWindowState)
            .returns(() => setWindowStatePayload.object);
        setWindowStatePayload.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setWindowState(testPayload);

        setWindowStatePayload.verifyAll();
        windowFrameActionCreatorMock.verifyAll();
    });
});
