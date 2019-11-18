// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { POPUP_INITIALIZED } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';

import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { PopupInitializedPayload } from './action-payloads';
import { TabActions } from './tab-actions';

export class PopupActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly tabActions: TabActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Popup.Initialized, (payload: PopupInitializedPayload) => {
            this.telemetryEventHandler.publishTelemetry(POPUP_INITIALIZED, payload);
            this.tabActions.newTabCreated.invoke(payload.tab);
        });
    }
}
