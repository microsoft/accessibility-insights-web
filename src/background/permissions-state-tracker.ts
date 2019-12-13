// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';

export class PermissionsStateTracker {
    constructor(private browserAdapter: BrowserAdapter, private interpreter: Interpreter) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnPermissionsAdded(this.notifyChange);
        this.browserAdapter.addListenerOnPermissionsRemoved(this.notifyChange);
        this.notifyChange();
    }

    public notifyChange(): void {
        const allUrlAndFilePermissions: string = '*://*/*';

        const permissionsState = this.browserAdapter.containsPermissions({
            origins: [allUrlAndFilePermissions],
        });

        const message: Message = {
            messageType: Messages.PermissionsState.PermissionsStateChanged,
            payload: permissionsState,
            tabId: null,
        };

        this.interpreter.interpret(message);
    }
}
