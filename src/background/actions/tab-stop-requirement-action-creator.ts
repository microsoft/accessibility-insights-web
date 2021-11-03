// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { Messages } from '../../common/messages';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    AddTabStopInstancePayload,
    RemoveTabStopInstancePayload,
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
}
