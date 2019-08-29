// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import * as TelemetryEvents from '../../common/telemetry-events';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectActions, InspectPayload } from './inspect-actions';

export class InspectActionCreator {
    private inspectActions: InspectActions;
    private browserAdapter: BrowserAdapter;
    private telemetryEventHandler: TelemetryEventHandler;
    private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback;

    constructor(
        inspectActions: InspectActions,
        telemetryEventHandler: TelemetryEventHandler,
        browserAdapter: BrowserAdapter,
        registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {
        this.inspectActions = inspectActions;
        this.telemetryEventHandler = telemetryEventHandler;
        this.browserAdapter = browserAdapter;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.Inspect.ChangeInspectMode, (payload: InspectPayload, tabId: number) =>
            this.onChangeInspectMode(payload, tabId),
        );
        this.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.InspectStore), () => this.onGetInspectCurrentState());
    }

    private onChangeInspectMode(payload: InspectPayload, tabId: number): void {
        const eventName = TelemetryEvents.CHANGE_INSPECT_MODE;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.browserAdapter.switchToTab(tabId);
        this.inspectActions.changeInspectMode.invoke(payload);
    }

    private onGetInspectCurrentState(): void {
        this.inspectActions.getCurrentState.invoke(null);
    }
}
