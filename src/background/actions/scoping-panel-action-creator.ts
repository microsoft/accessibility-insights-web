// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SCOPING_CLOSE } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { ScopingActions } from './scoping-actions';

export class ScopingPanelActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly scopingActions: ScopingActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.ClosePanel, payload =>
            this.onCloseScopingPanel(payload),
        );
    }

    private onCloseScopingPanel(payload: BaseActionPayload): void {
        this.scopingActions.closeScopingPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(SCOPING_CLOSE, payload);
    }
}
