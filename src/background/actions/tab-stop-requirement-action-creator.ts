// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { Messages } from '../../common/messages';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AddTabStopInstancePayload,
    BaseActionPayload,
    RemoveTabStopInstancePayload,
    ResetTabStopRequirementStatusPayload,
<<<<<<< HEAD
    ToggleTabStopRequirementExpandPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
=======
>>>>>>> de85b0fc6 (add action for undo button in requirements table)
    UpdateTabStopInstancePayload,
    UpdateTabStopRequirementStatusPayload,
} from './action-payloads';
import { TabStopRequirementActions } from './tab-stop-requirement-actions';

export class TabStopRequirementActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly tabStopRequirementActions: TabStopRequirementActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.UpdateTabStopsRequirementStatus,
            this.onUpdateTabStopsRequirementStatus,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.ResetTabStopsRequirementStatus,
            this.onResetTabStopsRequirementStatus,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.AddTabStopInstance,
            this.onAddTabStopInstance,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.UpdateTabStopInstance,
            this.onUpdateTabStopInstance,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.RemoveTabStopInstance,
            this.onRemoveTabStopInstance,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.RequirementExpansionToggled,
            this.onRequirementExpansionToggled,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.TabbingCompleted,
            this.onTabbingCompleted,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.NeedToCollectTabbingResults,
            this.onNeedToCollectTabbingResults,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.TabStops.AutomatedTabbingResultsCompleted,
            this.onAutomatedTabbingResultsCompleted,
        );
    }

    private onUpdateTabStopsRequirementStatus = (
        payload: UpdateTabStopRequirementStatusPayload,
    ): void => {
        this.tabStopRequirementActions.updateTabStopsRequirementStatus.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_STATUS,
            payload,
        );
    };

    private onResetTabStopsRequirementStatus = (
        payload: ResetTabStopRequirementStatusPayload,
    ): void => {
        this.tabStopRequirementActions.resetTabStopRequirementStatus.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.RESET_TABSTOPS_REQUIREMENT_STATUS,
            payload,
        );
    };

    private onAddTabStopInstance = (payload: AddTabStopInstancePayload): void => {
        this.tabStopRequirementActions.addTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.ADD_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onUpdateTabStopInstance = (payload: UpdateTabStopInstancePayload): void => {
        this.tabStopRequirementActions.updateTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onRemoveTabStopInstance = (payload: RemoveTabStopInstancePayload): void => {
        this.tabStopRequirementActions.removeTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.REMOVE_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onRequirementExpansionToggled = (
        payload: ToggleTabStopRequirementExpandPayload,
    ): void => {
        this.tabStopRequirementActions.toggleTabStopRequirementExpand.invoke(payload);
    };

    private onTabbingCompleted = (payload: UpdateTabbingCompletedPayload): void => {
        this.tabStopRequirementActions.updateTabbingCompleted.invoke(payload);
    };

    private onNeedToCollectTabbingResults = (
        payload: UpdateNeedToCollectTabbingResultsPayload,
    ): void => {
        this.tabStopRequirementActions.updateNeedToCollectTabbingResults.invoke(payload);
    };

    private onAutomatedTabbingResultsCompleted = (payload: BaseActionPayload): void => {
        this.tabStopRequirementActions.automatedTabbingResultsCompleted.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.TABSTOPS_AUTOMATED_RESULTS,
            payload,
        );
    };
}
