// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import * as TelemetryEvents from 'common/telemetry-events';

import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectElementPayload, InspectFrameUrlPayload, OnDevToolOpenPayload } from './action-payloads';
import { DevToolActions } from './dev-tools-actions';

export class DevToolsActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly devToolActions: DevToolActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.DevTools.DevtoolStatus, this.onDevToolOpened);
        this.interpreter.registerTypeToPayloadCallback(Messages.DevTools.InspectElement, this.onDevToolInspectElement);
        this.interpreter.registerTypeToPayloadCallback(Messages.DevTools.InspectFrameUrl, this.onDevToolInspectFrameUrl);
        this.interpreter.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.DevToolsStore), this.onDevToolGetCurrentState);
    }

    private onDevToolOpened = (payload: OnDevToolOpenPayload): void => {
        this.devToolActions.setDevToolState.invoke(payload.status);
    };

    private onDevToolInspectElement = (payload: InspectElementPayload): void => {
        this.devToolActions.setInspectElement.invoke(payload.target);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.INSPECT_OPEN, payload);
    };

    private onDevToolInspectFrameUrl = (payload: InspectFrameUrlPayload): void => {
        this.devToolActions.setFrameUrl.invoke(payload.frameUrl);
    };

    private onDevToolGetCurrentState = (): void => this.devToolActions.getCurrentState.invoke(null);
}
