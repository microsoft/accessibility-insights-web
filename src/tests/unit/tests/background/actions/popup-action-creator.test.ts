// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PopupInitializedPayload } from 'background/actions/action-payloads';
import { PopupActionCreator } from 'background/actions/popup-action-creator';
import { TabActions } from 'background/actions/tab-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { UsageLogger } from 'background/usage-logger';
import {
    POPUP_INITIALIZED,
    TelemetryEventSource,
    TriggeredBy,
} from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('PopupActionCreator', () => {
    it('handles Messages.Popup.Initialized', async () => {
        const payload: PopupInitializedPayload = {
            telemetry: {
                triggeredBy: 'test' as TriggeredBy,
                source: TelemetryEventSource.AdHocTools,
            },
            tab: {
                id: -1,
                title: 'test tab title',
                url: 'test url',
            },
        };

        const actionMock = createAsyncActionMock(payload.tab);
        const actionsMock = createTabActionsMock('newTabCreated', actionMock.object);
        const interpreterMock = new MockInterpreter();

        const telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        const usageLoggerMock = Mock.ofType<UsageLogger>();

        const testSubject = new PopupActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            usageLoggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Popup.Initialized, payload);

        actionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(POPUP_INITIALIZED, payload),
            Times.once(),
        );
        usageLoggerMock.verify(m => m.record(), Times.once());
    });

    function createTabActionsMock<ActionName extends keyof TabActions>(
        actionName: ActionName,
        action: TabActions[ActionName],
    ): IMock<TabActions> {
        const actionsMock = Mock.ofType<TabActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
