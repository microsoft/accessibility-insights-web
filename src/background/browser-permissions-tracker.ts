// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Message } from 'common/message';
import { Messages } from 'common/messages';

export const allUrlAndFilePermissions: string = '*://*/*';

export class BrowserPermissionsTracker {
    constructor(private browserAdapter: BrowserAdapter, private interpreter: Interpreter) {}

    public async initialize(): Promise<void> {
        this.browserAdapter.addListenerOnPermissionsAdded(this.notifyChange);
        this.browserAdapter.addListenerOnPermissionsRemoved(this.notifyChange);
        await this.notifyChange();
    }

    public async notifyChange(): Promise<void> {
        let payload: boolean;

        try {
            payload = await this.browserAdapter.containsPermissions({
                origins: [allUrlAndFilePermissions],
            });
        } catch (error) {
            payload = false;
            console.error(error);
        } finally {
            const message: Message = {
                messageType: Messages.PermissionsState.PermissionsStateChanged,
                payload: payload,
                tabId: null,
            };

            this.interpreter.interpret(message);
        }
    }
}
