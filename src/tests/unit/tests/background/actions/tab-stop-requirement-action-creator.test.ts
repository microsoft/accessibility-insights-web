// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddTabStopInstancePayload,
    UpdateTabStopInstancePayload,
    RemoveTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
    ResetTabStopRequirementStatusPayload,
    ToggleTabStopRequirementExpandPayload,
    UpdateTabbingCompletedPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    BaseActionPayload,
    AddTabStopInstanceArrayPayload,
} from 'background/actions/action-payloads';
import { TabStopRequirementActionCreator } from 'background/actions/tab-stop-requirement-action-creator';
import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, Times } from 'typemoq';

import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('TabStopRequirementActionCreator', () => {
    const requirementId = 'focus-indicator';
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        interpreterMock = new MockInterpreter();
    });

    test('registerCallback for update tab stops requirement status', async () => {
        const actionName = 'updateTabStopsRequirementStatus';
        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId: requirementId,
            status: 'pass',
        };

        const updateTabStopRequirementStatusMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            updateTabStopRequirementStatusMock.object,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.UpdateTabStopsRequirementStatus,
            payload,
        );

        updateTabStopRequirementStatusMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_STATUS,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for reset tab stops requirement status', async () => {
        const actionName = 'resetTabStopRequirementStatus';
        const payload: ResetTabStopRequirementStatusPayload = {
            requirementId: requirementId,
        };

        const resetTabStopRequirementStatusMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, resetTabStopRequirementStatusMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.ResetTabStopsRequirementStatus,
            payload,
        );

        resetTabStopRequirementStatusMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.RESET_TABSTOPS_REQUIREMENT_STATUS,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for add tab stops requirement instance', async () => {
        const actionName = 'addTabStopInstance';

        const payload: AddTabStopInstancePayload = {
            requirementId: requirementId,
            description: 'testing',
        };

        const addTabStopRequirementInstanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, addTabStopRequirementInstanceMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.AddTabStopInstance,
            payload,
        );

        addTabStopRequirementInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.ADD_TABSTOPS_REQUIREMENT_INSTANCE,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for add tab stops requirement instance', async () => {
        const actionName = 'addTabStopInstance';

        const payload: AddTabStopInstancePayload = {
            requirementId: requirementId,
            description: 'testing',
        };

        const addTabStopRequirementInstanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, addTabStopRequirementInstanceMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.AddTabStopInstance,
            payload,
        );

        addTabStopRequirementInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.ADD_TABSTOPS_REQUIREMENT_INSTANCE,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for add tab stops instances array', async () => {
        const actionName = 'addTabStopInstanceArray';

        const payload: AddTabStopInstanceArrayPayload = {
            results: [
                { requirementId: requirementId, description: 'instance 1' },
                { requirementId: requirementId, description: 'instance 2' },
            ],
        };

        const addTabStopRequirementInstanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, addTabStopRequirementInstanceMock.object);

        payload.results.forEach(result => {
            telemetryEventHandlerMock
                .setup(t =>
                    t.publishTelemetry(TelemetryEvents.ADD_TABSTOPS_REQUIREMENT_INSTANCE, result),
                )
                .verifiable(Times.once());
        });

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.AddTabStopInstanceArray,
            payload,
        );

        addTabStopRequirementInstanceMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    test('registerCallback for update tab stops requirement instance', async () => {
        const actionName = 'updateTabStopInstance';

        const payload: UpdateTabStopInstancePayload = {
            requirementId: requirementId,
            description: 'testing',
            id: 'abc',
        };

        const updateTabStopRequirementInstanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            updateTabStopRequirementInstanceMock.object,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.UpdateTabStopInstance,
            payload,
        );

        updateTabStopRequirementInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_INSTANCE,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for on requirement expansion toggled', async () => {
        const actionName = 'toggleTabStopRequirementExpand';
        const payload: ToggleTabStopRequirementExpandPayload = {
            requirementId: requirementId,
        };

        const onRequirementExpansionToggledMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, onRequirementExpansionToggledMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.RequirementExpansionToggled,
            payload,
        );

        onRequirementExpansionToggledMock.verifyAll();
    });

    test('registerCallback for remove tab stops requirement instance', async () => {
        const actionName = 'removeTabStopInstance';

        const payload: RemoveTabStopInstancePayload = {
            requirementId: requirementId,
            id: 'abc',
        };

        const removeTabStopRequirementInstanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            removeTabStopRequirementInstanceMock.object,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.RemoveTabStopInstance,
            payload,
        );

        removeTabStopRequirementInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.REMOVE_TABSTOPS_REQUIREMENT_INSTANCE,
                    payload,
                ),
            Times.once(),
        );
    });

    test('registerCallback for on tabbing completed', async () => {
        const actionName = 'updateTabbingCompleted';
        const payload: UpdateTabbingCompletedPayload = {
            tabbingCompleted: true,
        };

        const onTabbingCompletedMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, onTabbingCompletedMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.TabbingCompleted,
            payload,
        );

        onTabbingCompletedMock.verifyAll();
    });

    test('registerCallback for on need to collect tabbing results', async () => {
        const actionName = 'updateNeedToCollectTabbingResults';
        const payload: UpdateNeedToCollectTabbingResultsPayload = {
            needToCollectTabbingResults: true,
        };

        const onNeedToCollectTabbingResultsMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, onNeedToCollectTabbingResultsMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.NeedToCollectTabbingResults,
            payload,
        );

        onNeedToCollectTabbingResultsMock.verifyAll();
    });

    test('registerCallback for automated tabbing results completed', async () => {
        const actionName = 'automatedTabbingResultsCompleted';

        const payload: BaseActionPayload = {
            telemetry: {} as TelemetryEvents.TelemetryData,
        };

        const instanceMock = createAsyncActionMock(payload);

        const actionsMock = createActionsMock(actionName, instanceMock.object);

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.TabStops.AutomatedTabbingResultsCompleted,
            payload,
        );

        instanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(TelemetryEvents.TABSTOPS_AUTOMATED_RESULTS, payload),
            Times.once(),
        );
    });

    function createActionsMock<ActionName extends keyof TabStopRequirementActions>(
        actionName: ActionName,
        action: TabStopRequirementActions[ActionName],
    ): IMock<TabStopRequirementActions> {
        const actionsMock = Mock.ofType<TabStopRequirementActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
