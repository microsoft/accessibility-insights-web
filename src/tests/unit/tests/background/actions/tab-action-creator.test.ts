// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExistingTabUpdatedPayload,
    PageVisibilityChangeTabPayload,
    SwitchToTargetTabPayload,
} from 'background/actions/action-payloads';
import { TabActionCreator } from 'background/actions/tab-action-creator';
import { TabActions } from 'background/actions/tab-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import {
    EXISTING_TAB_URL_UPDATED,
    SWITCH_BACK_TO_TARGET,
    TelemetryEventSource,
    TriggeredBy,
    TriggeredByNotApplicable,
} from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe(TabActionCreator, () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let loggerMock: IMock<Logger>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        loggerMock = Mock.ofType<Logger>();
        interpreterMock = new MockInterpreter();
    });

    it('handles Tab.NewTabCreated message', async () => {
        const payload = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
            telemetry: null,
        };

        const actionMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock('newTabCreated', actionMock.object);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            telemetryEventHandlerMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Tab.NewTabCreated, payload);

        actionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(null, payload),
            Times.never(),
        );
    });

    it('handles Tab.GetCurrent message', async () => {
        const getCurrentStateMock = createAsyncActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(getStoreStateMessage(StoreNames.TabStore), null);

        getCurrentStateMock.verifyAll();
    });

    it('handles Tab.Remove message', async () => {
        const tabIdStub = -1;
        const expectedScope = 'TabActionCreator:-1';
        const tabRemoveMock = createAsyncActionMock<void>(null, expectedScope);
        const actionsMock = createActionsMock('tabRemove', tabRemoveMock.object);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Tab.Remove, null, tabIdStub);

        tabRemoveMock.verifyAll();
    });

    it('handles Tab.ExistingTabUpdated message', async () => {
        const payload: ExistingTabUpdatedPayload = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
            telemetry: {
                source: null,
                triggeredBy: TriggeredByNotApplicable,
            },
        };

        const actionMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock('existingTabUpdated', actionMock.object);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            telemetryEventHandlerMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Tab.ExistingTabUpdated, payload);

        actionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(EXISTING_TAB_URL_UPDATED, payload),
            Times.once(),
        );
    });

    describe('handles Tab.Switch message', () => {
        const payload: SwitchToTargetTabPayload = {
            telemetry: {
                triggeredBy: 'test' as TriggeredBy,
                source: TelemetryEventSource.AdHocTools,
            },
        };

        const tabId: number = -1;

        let testSubject: TabActionCreator;

        beforeEach(() => {
            testSubject = new TabActionCreator(
                interpreterMock.object,
                null,
                browserAdapterMock.object,
                telemetryEventHandlerMock.object,
                loggerMock.object,
            );
        });

        it('switch to tab succeed', async () => {
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.resolve());

            testSubject.registerCallbacks();

            await interpreterMock.simulateMessage(Messages.Tab.Switch, payload, tabId);

            telemetryEventHandlerMock.verify(
                tp => tp.publishTelemetry(SWITCH_BACK_TO_TARGET, payload),
                Times.once(),
            );
        });

        it('logs error when switch to tab fails', async () => {
            const dummyError = 'switch to tab dummy error';
            browserAdapterMock
                .setup(adapter => adapter.switchToTab(tabId))
                .returns(() => Promise.reject(dummyError));

            testSubject.registerCallbacks();

            await interpreterMock.simulateMessage(Messages.Tab.Switch, payload, tabId);

            telemetryEventHandlerMock.verify(
                tp => tp.publishTelemetry(SWITCH_BACK_TO_TARGET, payload),
                Times.once(),
            );
            loggerMock.verify(
                logger => logger.error(`switchToTab failed: ${dummyError}`, dummyError),
                Times.once(),
            );
        });
    });

    it('handles Tab.VisibilityChange message', async () => {
        const tabIdStub = -1;
        const expectedScope = 'TabActionCreator:-1';
        const payload: PageVisibilityChangeTabPayload = {
            hidden: true,
        };

        const tabVisibilityChangeMock = createAsyncActionMock(payload.hidden, expectedScope);
        const actionsMock = createActionsMock(
            'tabVisibilityChange',
            tabVisibilityChangeMock.object,
        );

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Tab.VisibilityChange, payload, tabIdStub);

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
