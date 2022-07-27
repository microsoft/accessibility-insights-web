// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { ScopingActions, ScopingPayload } from '../actions/scoping-actions';
import { Interpreter } from '../interpreter';

export class ScopingActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly scopingActions: ScopingActions,
    ) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.ScopingPanelStateStore),
            this.onGetScopingState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Scoping.AddSelector,
            this.onAddSelector,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Scoping.DeleteSelector,
            this.onDeleteSelector,
        );
    }

    private onGetScopingState = async (): Promise<void> => {
        await this.scopingActions.getCurrentState.invoke();
    };

    private onAddSelector = async (payload: ScopingPayload): Promise<void> => {
        await this.scopingActions.addSelector.invoke(payload);
    };

    private onDeleteSelector = async (payload: ScopingPayload): Promise<void> => {
        await this.scopingActions.deleteSelector.invoke(payload);
    };
}
