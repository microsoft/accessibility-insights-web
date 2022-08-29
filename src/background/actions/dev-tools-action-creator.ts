// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectElementPayload, InspectFrameUrlPayload } from './action-payloads';
import { DevToolActions } from './dev-tools-actions';

export class DevToolsActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly devToolActions: DevToolActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.DevTools.Opened,
            this.onDevToolOpened,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.DevTools.Closed,
            this.onDevToolClosed,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.DevTools.InspectElement,
            this.onDevToolInspectElement,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.DevTools.InspectFrameUrl,
            this.onDevToolInspectFrameUrl,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.DevToolsStore),
            this.onDevToolGetCurrentState,
        );
    }

    private onDevToolOpened = async (): Promise<void> => {
        await this.devToolActions.setDevToolState.invoke(true);
    };

    private onDevToolClosed = async (): Promise<void> => {
        await this.devToolActions.setDevToolState.invoke(false);
    };

    private onDevToolInspectElement = async (payload: InspectElementPayload): Promise<void> => {
        await this.devToolActions.setInspectElement.invoke(payload.target);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.INSPECT_OPEN, payload);
    };

    private onDevToolInspectFrameUrl = async (payload: InspectFrameUrlPayload): Promise<void> => {
        await this.devToolActions.setFrameUrl.invoke(payload.frameUrl);
    };

    private onDevToolGetCurrentState = async (): Promise<void> =>
        await this.devToolActions.getCurrentState.invoke(null);
}
