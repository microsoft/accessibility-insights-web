// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationTogglePayload } from 'background/actions/action-payloads';
import { Message } from '../message';
import { Messages } from '../messages';
import { ToggleTelemetryData } from '../extension-telemetry-events';
import { VisualizationType } from '../types/visualization-type';
import { ActionMessageDispatcher } from './action-message-dispatcher';

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
}
