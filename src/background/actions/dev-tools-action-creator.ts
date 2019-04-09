// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import * as TelemetryEvents from '../../common/telemetry-events';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectElementPayload, InspectFrameUrlPayload, OnDevToolOpenPayload } from './action-payloads';
import { DevToolActions } from './dev-tools-actions';

export class DevToolsActionCreator {
    private devtoolActions: DevToolActions;
    private telemetryEventHandler: TelemetryEventHandler;
    private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback;

    constructor(
        devToolsAction: DevToolActions,
        telemetryEventHandler: TelemetryEventHandler,
        registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {
        this.devtoolActions = devToolsAction;
        this.telemetryEventHandler = telemetryEventHandler;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.DevTools.DevtoolStatus, payload => this.onDevToolOpened(payload));

        this.registerTypeToPayloadCallback(Messages.DevTools.InspectElement, payload => this.onDevToolInspectElement(payload));

        this.registerTypeToPayloadCallback(Messages.DevTools.InspectFrameUrl, payload => this.onDevToolInspectFrameUrl(payload));

        this.registerTypeToPayloadCallback(Messages.DevTools.Get, () => this.onDevToolGetCurrentState());
    }

    private onDevToolOpened(payload: OnDevToolOpenPayload): void {
        this.devtoolActions.setDevToolState.invoke(payload.status);
    }

    private onDevToolInspectElement(payload: InspectElementPayload): void {
        this.devtoolActions.setInspectElement.invoke(payload.target);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.INSPECT_OPEN, payload);
    }

    private onDevToolInspectFrameUrl(payload: InspectFrameUrlPayload): void {
        this.devtoolActions.setFrameUrl.invoke(payload.frameUrl);
    }

    private onDevToolGetCurrentState(): void {
        this.devtoolActions.getCurrentState.invoke(null);
    }
}
