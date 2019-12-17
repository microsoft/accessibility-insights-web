// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { Interpreter } from '../interpreter';

export class PermissionsStateActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly permissionsStateActions: PermissionsStateActions,
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
        this.permissionsStateActions.getCurrentState.invoke(null);
    };

    private onSetPermissionsState = (payload: boolean): void => {
        this.permissionsStateActions.setPermissionsState.invoke(payload);
    };
}
