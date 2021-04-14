// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { ALL_URLS_PERMISSION_UPDATED } from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';

export class PermissionsStateActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly permissionsStateActions: PermissionsStateActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.PermissionsStateStore),
            this.onGetCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PermissionsState.SetPermissionsState,
            this.onSetPermissionsState,
        );
    }

    private onGetCurrentState = (): void => {
        this.permissionsStateActions.getCurrentState.invoke();
    };

    private onSetPermissionsState = (payload: SetAllUrlsPermissionStatePayload): void => {
        this.permissionsStateActions.setPermissionsState.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(ALL_URLS_PERMISSION_UPDATED, payload);
    };
}
