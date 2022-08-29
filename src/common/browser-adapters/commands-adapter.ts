// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type CommandsAdapter = {
    addCommandListener(callback: (command: string) => void): void;
    getCommands(): Promise<chrome.commands.Command[]>;
};
