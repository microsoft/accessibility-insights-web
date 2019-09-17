// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import * as TelemetryEvents from 'common/telemetry-events';

import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectActions, InspectPayload } from './inspect-actions';

export class InspectActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly inspectActions: InspectActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly browserAdapter: BrowserAdapter,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Inspect.ChangeInspectMode, (payload: InspectPayload, tabId: number) =>
            this.onChangeInspectMode(payload, tabId),
        );
        this.interpreter.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.InspectStore), () =>
            this.onGetInspectCurrentState(),
        );
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
