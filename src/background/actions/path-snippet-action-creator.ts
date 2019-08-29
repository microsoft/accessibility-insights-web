// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { getStoreStateMessage, Messages } from '../../common/messages';
import { StoreNames } from '../../common/stores/store-names';
import { PathSnippetActions } from './path-snippet-actions';

export class PathSnippetActionCreator {
    constructor(
        private readonly pathSnippetActions: PathSnippetActions,
        private readonly registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {}

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(getStoreStateMessage(StoreNames.PathSnippetStore), this.onGetPathSnippetCurrentState);
        this.registerTypeToPayloadCallback(Messages.PathSnippet.AddPathForValidation, this.onAddPathForValidation);
        this.registerTypeToPayloadCallback(Messages.PathSnippet.AddCorrespondingSnippet, this.onAddCorrespondingSnippet);
        this.registerTypeToPayloadCallback(Messages.PathSnippet.ClearPathSnippetData, this.onClearPathSnippetData);
    }

    private onAddPathForValidation = (payload: string): void => {
        this.pathSnippetActions.onAddPath.invoke(payload);
    };

    private onAddCorrespondingSnippet = (payload: string): void => {
        this.pathSnippetActions.onAddSnippet.invoke(payload);
    };

    private onGetPathSnippetCurrentState = (): void => {
        this.pathSnippetActions.getCurrentState.invoke(null);
    };

    private onClearPathSnippetData = (): void => {
        this.pathSnippetActions.onClearData.invoke(null);
    };
}
