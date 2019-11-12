// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationTogglePayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

import { TelemetryEventSource, ToggleTelemetryData, TriggeredBy } from '../extension-telemetry-events';
import { Message } from '../message';
import { Messages } from '../messages';
import { VisualizationType } from '../types/visualization-type';

export class VisualizationActionMessageCreator {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public setVisualizationState(test: VisualizationType, enabled: boolean, telemetry: ToggleTelemetryData): void {
        const payload: VisualizationTogglePayload = {
            test,
            enabled,
            telemetry,
        };

        const message: Message = {
            messageType: Messages.Visualizations.Common.Toggle,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    }

    private setVisualizationStateForRescan(
        test: VisualizationType,
        enabled: boolean,
        source: TelemetryEventSource,
        triggeredBy: TriggeredBy,
    ): void {
        const telemetry: ToggleTelemetryData = {
            isRescan: true,
            source: source,
            triggeredBy: triggeredBy,
            enabled,
        };

        this.setVisualizationState(test, enabled, telemetry);
    }

    public rescanVisualization(test: VisualizationType, source: TelemetryEventSource, triggeredBy: TriggeredBy): void {
        this.setVisualizationStateForRescan(test, false, source, triggeredBy);
        this.setVisualizationStateForRescan(test, true, source, triggeredBy);
    }
}
