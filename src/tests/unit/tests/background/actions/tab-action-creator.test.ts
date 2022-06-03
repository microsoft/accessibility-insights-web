// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ExistingTabUpdatedPayload,
    PageVisibilityChangeTabPayload,
    SwitchToTargetTabPayload,
} from 'background/actions/action-payloads';
import { TabActionCreator } from 'background/actions/tab-action-creator';
import { TabActions } from 'background/actions/tab-actions';
import { Interpreter } from 'background/interpreter';
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
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, Mock, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('TestActionCreatorTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        loggerMock = Mock.ofType<Logger>();
    });

    it('handles Tab.NewTabCreated message', () => {
        const payload = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
            telemetry: null,
        };

        const actionMock = createActionMock(payload);
        const actionsMock = createActionsMock('newTabCreated', actionMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.NewTabCreated, payload);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            telemetryEventHandlerMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        actionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(null, payload),
            Times.never(),
        );
    });

    it('handles Tab.GetCurrent message', () => {
        const getCurrentStateMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.TabStore),
            null,
        );

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it('handles Tab.Remove message', () => {
        const tabRemoveMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('tabRemove', tabRemoveMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.Remove, null);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

        tabRemoveMock.verifyAll();
    });

    it('handles Tab.ExistingTabUpdated message', () => {
        const payload: ExistingTabUpdatedPayload = {
            id: -1,
            title: 'test tab title',
            url: 'test url',
            telemetry: {
                source: null,
                triggeredBy: TriggeredByNotApplicable,
            },
        };

        const actionMock = createActionMock(payload);
        const actionsMock = createActionsMock('existingTabUpdated', actionMock.object);
        const interpreterMock = createInterpreterMock(Messages.Tab.ExistingTabUpdated, payload);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            telemetryEventHandlerMock.object,
            loggerMock.object,
        );

        testSubject.registerCallbacks();

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

        let interpreterMock: IMock<Interpreter>;
        let testSubject: TabActionCreator;

        beforeEach(() => {
            interpreterMock = createInterpreterMock(Messages.Tab.Switch, payload, tabId);

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

            await flushSettledPromises();

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

            await flushSettledPromises();

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

    it('handles Tab.VisibilityChange message', () => {
        const payload: PageVisibilityChangeTabPayload = {
            hidden: true,
        };

        const tabVisibilityChangeMock = createActionMock(payload.hidden);
        const actionsMock = createActionsMock(
            'tabVisibilityChange',
            tabVisibilityChangeMock.object,
        );
        const interpreterMock = createInterpreterMock(Messages.Tab.VisibilityChange, payload);

        const testSubject = new TabActionCreator(
            interpreterMock.object,
            actionsMock.object,
            null,
            null,
            loggerMock.object,
        );

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
