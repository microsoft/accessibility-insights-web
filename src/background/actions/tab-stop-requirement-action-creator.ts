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
    ToggleTabStopRequirementExpandPayload,
    UpdateNeedToCollectTabbingResultsPayload,
    UpdateTabbingCompletedPayload,
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

    private onUpdateTabStopsRequirementStatus = async (
        payload: UpdateTabStopRequirementStatusPayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.updateTabStopsRequirementStatus.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_STATUS,
            payload,
        );
    };

    private onResetTabStopsRequirementStatus = async (
        payload: ResetTabStopRequirementStatusPayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.resetTabStopRequirementStatus.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.RESET_TABSTOPS_REQUIREMENT_STATUS,
            payload,
        );
    };

    private onAddTabStopInstance = async (payload: AddTabStopInstancePayload): Promise<void> => {
        await this.tabStopRequirementActions.addTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.ADD_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onUpdateTabStopInstance = async (
        payload: UpdateTabStopInstancePayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.updateTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.UPDATE_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onRemoveTabStopInstance = async (
        payload: RemoveTabStopInstancePayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.removeTabStopInstance.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.REMOVE_TABSTOPS_REQUIREMENT_INSTANCE,
            payload,
        );
    };

    private onRequirementExpansionToggled = async (
        payload: ToggleTabStopRequirementExpandPayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.toggleTabStopRequirementExpand.invoke(payload);
    };

    private onTabbingCompleted = async (payload: UpdateTabbingCompletedPayload): Promise<void> => {
        await this.tabStopRequirementActions.updateTabbingCompleted.invoke(payload);
    };

    private onNeedToCollectTabbingResults = async (
        payload: UpdateNeedToCollectTabbingResultsPayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.updateNeedToCollectTabbingResults.invoke(payload);
    };

    private onAutomatedTabbingResultsCompleted = async (
        payload: BaseActionPayload,
    ): Promise<void> => {
        await this.tabStopRequirementActions.automatedTabbingResultsCompleted.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.TABSTOPS_AUTOMATED_RESULTS,
            payload,
        );
    };
}
