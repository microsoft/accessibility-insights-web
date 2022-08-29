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

    private onAddPathForValidation = async (payload: string): Promise<void> => {
        await this.pathSnippetActions.onAddPath.invoke(payload);
    };

    private onAddCorrespondingSnippet = async (payload: string): Promise<void> => {
        await this.pathSnippetActions.onAddSnippet.invoke(payload);
    };

    private onGetPathSnippetCurrentState = async (): Promise<void> => {
        await this.pathSnippetActions.getCurrentState.invoke();
    };

    private onClearPathSnippetData = async (): Promise<void> => {
        await this.pathSnippetActions.onClearData.invoke();
    };
}
