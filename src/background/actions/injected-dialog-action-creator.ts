// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { Interpreter } from '../interpreter';
import { InjectedDialogOpenPayload } from './action-payloads';
import { InjectedDialogActions as InjectedDialogActions } from './injected-dialog-actions';

export class InjectedDialogActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly injectedDialogActions: InjectedDialogActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.InjectedDialog.Open,
            this.onOpenDialog,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.InjectedDialog.Close,
            this.onCloseDialog,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.InjectedDialogStore),
            () => this.injectedDialogActions.getCurrentState.invoke(),
        );
    }

    private onOpenDialog = (payload: InjectedDialogOpenPayload): void => {
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ISSUES_DIALOG_OPENED, payload);
        this.injectedDialogActions.openDialog.invoke(payload);
    };

    private onCloseDialog = (): void => {
        this.injectedDialogActions.closeDialog.invoke();
    };
}
