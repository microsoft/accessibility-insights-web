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
} from 'background/actions/action-payloads';
import { TabStopRequirementActionCreator } from 'background/actions/tab-stop-requirement-action-creator';
import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('TabStopRequirementActionCreator', () => {
    const requirementId = 'focus-indicator';
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    test('registerCallback for update tab stops requirement status', () => {
        const actionName = 'updateTabStopsRequirementStatus';
        const payload: UpdateTabStopRequirementStatusPayload = {
            requirementId: requirementId,
            status: 'pass',
        };

        const updateTabStopRequirementStatusMock = createActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            updateTabStopRequirementStatusMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.UpdateTabStopsRequirementStatus,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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

    test('registerCallback for reset tab stops requirement status', () => {
        const actionName = 'resetTabStopRequirementStatus';
        const payload: ResetTabStopRequirementStatusPayload = {
            requirementId: requirementId,
        };

        const resetTabStopRequirementStatusMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, resetTabStopRequirementStatusMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.ResetTabStopsRequirementStatus,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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

    test('registerCallback for add tab stops requirement instance', () => {
        const actionName = 'addTabStopInstance';

        const payload: AddTabStopInstancePayload = {
            requirementId: requirementId,
            description: 'testing',
        };

        const addTabStopRequirementInstanceMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, addTabStopRequirementInstanceMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.AddTabStopInstance,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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

    test('registerCallback for update tab stops requirement instance', () => {
        const actionName = 'updateTabStopInstance';

        const payload: UpdateTabStopInstancePayload = {
            requirementId: requirementId,
            description: 'testing',
            id: 'abc',
        };

        const updateTabStopRequirementInstanceMock = createActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            updateTabStopRequirementInstanceMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.UpdateTabStopInstance,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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

    test('registerCallback for on requirement expansion toggled', () => {
        const actionName = 'toggleTabStopRequirementExpand';
        const payload: ToggleTabStopRequirementExpandPayload = {
            requirementId: requirementId,
        };

        const onRequirementExpansionToggledMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, onRequirementExpansionToggledMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.RequirementExpansionToggled,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        onRequirementExpansionToggledMock.verifyAll();
    });

    test('registerCallback for remove tab stops requirement instance', () => {
        const actionName = 'removeTabStopInstance';

        const payload: RemoveTabStopInstancePayload = {
            requirementId: requirementId,
            id: 'abc',
        };

        const removeTabStopRequirementInstanceMock = createActionMock(payload);

        const actionsMock = createActionsMock(
            actionName,
            removeTabStopRequirementInstanceMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.RemoveTabStopInstance,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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

    test('registerCallback for on tabbing completed', () => {
        const actionName = 'updateTabbingCompleted';
        const payload: UpdateTabbingCompletedPayload = {
            tabbingCompleted: true,
        };

        const onTabbingCompletedMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, onTabbingCompletedMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.TabbingCompleted,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        onTabbingCompletedMock.verifyAll();
    });

    test('registerCallback for on need to collect tabbing results', () => {
        const actionName = 'updateNeedToCollectTabbingResults';
        const payload: UpdateNeedToCollectTabbingResultsPayload = {
            needToCollectTabbingResults: true,
        };

        const onNeedToCollectTabbingResultsMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, onNeedToCollectTabbingResultsMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.NeedToCollectTabbingResults,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        onNeedToCollectTabbingResultsMock.verifyAll();
    });

    test('registerCallback for automated tabbing results completed', () => {
        const actionName = 'automatedTabbingResultsCompleted';

        const payload: BaseActionPayload = {
            telemetry: {} as TelemetryEvents.TelemetryData,
        };

        const instanceMock = createActionMock(payload);

        const actionsMock = createActionsMock(actionName, instanceMock.object);
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.TabStops.AutomatedTabbingResultsCompleted,
            payload,
        );

        const testSubject = new TabStopRequirementActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

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
