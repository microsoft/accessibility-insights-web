// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';

export interface GetCommandsPayload {
    commands: chrome.commands.Command[];
    tabId: number;
}

export class CommandActions {
    public readonly getCommands = new AsyncAction<GetCommandsPayload>();
}
