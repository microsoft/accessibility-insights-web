// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { InjectionActions } from '../actions/injection-actions';
import { Interpreter } from '../interpreter';

export class InjectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly injectionActions: InjectionActions,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.State.InjectionStarted,
            this.injectionStarted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.State.InjectionCompleted,
            this.injectionCompleted,
        );
    }

    private injectionStarted = (): void =>
        this.injectionActions.injectionStarted.invoke(null);

    private injectionCompleted = (): void =>
        this.injectionActions.injectionCompleted.invoke(null);
}
