// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export interface GetCommandsPayload {
    commands: chrome.commands.Command[];
    tabId: number;
}

export class CommandActions {
    public readonly getCommands = new Action<GetCommandsPayload>();
}
