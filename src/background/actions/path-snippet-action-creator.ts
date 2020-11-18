// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { Interpreter } from '../interpreter';
import { PathSnippetActions } from './path-snippet-actions';

export class PathSnippetActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly pathSnippetActions: PathSnippetActions,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.PathSnippetStore),
            this.onGetPathSnippetCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PathSnippet.AddPathForValidation,
            this.onAddPathForValidation,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PathSnippet.AddCorrespondingSnippet,
            this.onAddCorrespondingSnippet,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PathSnippet.ClearPathSnippetData,
            this.onClearPathSnippetData,
        );
    }

    private onAddPathForValidation = (payload: string): void => {
        this.pathSnippetActions.onAddPath.invoke(payload);
    };

    private onAddCorrespondingSnippet = (payload: string): void => {
        this.pathSnippetActions.onAddSnippet.invoke(payload);
    };

    private onGetPathSnippetCurrentState = (): void => {
        this.pathSnippetActions.getCurrentState.invoke();
    };

    private onClearPathSnippetData = (): void => {
        this.pathSnippetActions.onClearData.invoke();
    };
}
