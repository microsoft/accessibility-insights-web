// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import { ScopingActions, ScopingPayload } from '../actions/scoping-actions';
import { Interpreter } from '../interpreter';

export class ScopingActionCreator {
    constructor(private readonly interpreter: Interpreter, private readonly scopingActions: ScopingActions) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.GetCurrentState, this.onGetScopingState);
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.AddSelector, this.onAddSelector);
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.DeleteSelector, this.onDeleteSelector);
    }

    private onGetScopingState = (): void => {
        this.scopingActions.getCurrentState.invoke(null);
    };

    private onAddSelector = (payload: ScopingPayload): void => {
        this.scopingActions.addSelector.invoke(payload);
    };

    private onDeleteSelector = (payload: ScopingPayload): void => {
        this.scopingActions.deleteSelector.invoke(payload);
    };
}
