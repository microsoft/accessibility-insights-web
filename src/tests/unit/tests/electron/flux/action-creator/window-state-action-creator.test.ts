// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { RoutePayload } from 'electron/flux/action/route-payloads';
import { WindowStateActions } from 'electron/flux/action/window-state-actions';
import { IMock, Mock, Times } from 'typemoq';

describe(WindowStateActionCreator, () => {
    let windowStateActionsMock: IMock<WindowStateActions>;
    let testSubject: WindowStateActionCreator;

    beforeEach(() => {
        windowStateActionsMock = Mock.ofType<WindowStateActions>();
        testSubject = new WindowStateActionCreator(windowStateActionsMock.object);
    });

    it('calling setRoute invokes setRoute action with given payload', () => {
        const setRouteActionMock = Mock.ofType<Action<RoutePayload>>();
        const testPayload: RoutePayload = {
            routeId: 'resultsView',
        };
        windowStateActionsMock.setup(actions => actions.setRoute).returns(() => setRouteActionMock.object);
        setRouteActionMock.setup(s => s.invoke(testPayload)).verifiable(Times.once());

        testSubject.setRoute(testPayload);

        setRouteActionMock.verifyAll();
    });
});
