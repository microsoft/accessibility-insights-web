// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import { PathSnippetActions } from './path-snippet-actions';

export class PathSnippetActionCreator {
    constructor(
        private readonly pathSnippetActions: PathSnippetActions,
        private readonly registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
    ) {}

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.PathSnippet.AddPathForValidation, this.onAddPathForValidation);
    }

    private onAddPathForValidation = (payload: string): void => {
        this.pathSnippetActions.onAddPath.invoke(payload);
    };
}
