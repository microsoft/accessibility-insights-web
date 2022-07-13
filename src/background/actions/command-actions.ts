// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';

export interface GetCommandsPayload {
    commands: chrome.commands.Command[];
    tabId: number;
}

export class CommandActions {
    public readonly getCommands = new SyncAction<GetCommandsPayload>();
}
