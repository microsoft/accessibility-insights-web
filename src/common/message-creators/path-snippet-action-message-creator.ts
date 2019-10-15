// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dispatcher } from 'common/message-creators/types/dispatcher';

import { Messages } from '../messages';

export class PathSnippetActionMessageCreator {
    constructor(private readonly dispatcher: Dispatcher) {}

    public addCorrespondingSnippet = (snippet: string): void => {
        const messageType = Messages.PathSnippet.AddCorrespondingSnippet;
        const payload = snippet;
        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };
}
