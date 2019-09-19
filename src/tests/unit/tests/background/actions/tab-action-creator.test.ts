// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PageVisibilityChangeTabPayload, SwitchToTargetTabPayload } from 'background/actions/action-payloads';
import { TabActionCreator } from 'background/actions/tab-action-creator';
import { TabActions } from 'background/actions/tab-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { SWITCH_BACK_TO_TARGET, TelemetryEventSource, TriggeredBy } from 'common/extension-telemetry-events';
import { Tab } from 'common/itab';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { IMock, Mock, Times } from 'typemoq';

import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';

describe('TestActionCreatorTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('handles Tab.Update message', () => {
        const payload: Tab = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
        };

        const tabUpdateMock = createActionMock(payload);
        const actionsMock = createActionsMock('tabUpdate', tabUpdateMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.Update, payload);

        const testSubject = new TabActionCreator(interpreterMock.object, actionsMock.object, null, null);

        testSubject.registerCallbacks();

        tabUpdateMock.verifyAll();
    });

    it('handles Tab.GetCurrent message', () => {
        const getCurrentStateMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(getStoreStateMessage(StoreNames.TabStore), null);

        const testSubject = new TabActionCreator(interpreterMock.object, actionsMock.object, null, null);

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it('handles Tab.Remove message', () => {
        const tabRemoveMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('tabRemove', tabRemoveMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.Remove, null);

        const testSubject = new TabActionCreator(interpreterMock.object, actionsMock.object, null, null);

        testSubject.registerCallbacks();

        tabRemoveMock.verifyAll();
    });

    it('handles Tab.Change message', () => {
        const payload: Tab = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
        };

        const tabChangeMock = createActionMock(payload);
        const actionsMock = createActionsMock('tabChange', tabChangeMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.Change, payload);

        const testSubject = new TabActionCreator(interpreterMock.object, actionsMock.object, null, null);

        testSubject.registerCallbacks();

        tabChangeMock.verifyAll();
    });

    it('handles Tab.Switch message', () => {
        const payload: SwitchToTargetTabPayload = {
            telemetry: {
                triggeredBy: 'test' as TriggeredBy,
                source: TelemetryEventSource.AdHocTools,
            },
        };

        const tabId: number = -1;

        const interpreterMock = createInterpreterMock(Messages.Tab.Switch, payload, tabId);

        const testSubject = new TabActionCreator(interpreterMock.object, null, browserAdapterMock.object, telemetryEventHandlerMock.object);

        testSubject.registerCallbacks();

        browserAdapterMock.verify(ba => ba.switchToTab(tabId), Times.once());
        telemetryEventHandlerMock.verify(tp => tp.publishTelemetry(SWITCH_BACK_TO_TARGET, payload), Times.once());
    });

    it('handles Tab.VisibilityChange message', () => {
        const payload: PageVisibilityChangeTabPayload = {
            hidden: true,
        };

        const tabVisibilityChangeMock = createActionMock(payload.hidden);
        const actionsMock = createActionsMock('tabVisibilityChange', tabVisibilityChangeMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.VisibilityChange, payload);

        const testSubject = new TabActionCreator(interpreterMock.object, actionsMock.object, null, null);

        testSubject.registerCallbacks();

        tabVisibilityChangeMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof TabActions>(
        actionName: ActionName,
        action: TabActions[ActionName],
    ): IMock<TabActions> {
        const actionsMock = Mock.ofType<TabActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
