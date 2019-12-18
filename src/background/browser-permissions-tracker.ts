// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { Permissions } from 'webextension-polyfill-ts';

export const allUrlAndFilePermissions: Permissions.Permissions = { origins: ['*://*/*'] };

export class BrowserPermissionsTracker {
    constructor(
        private browserAdapter: BrowserAdapter,
        private interpreter: Interpreter,
        private readonly logger: Logger,
    ) {}

    public async initialize(): Promise<void> {
        this.browserAdapter.addListenerOnPermissionsAdded(this.notifyChange);
        this.browserAdapter.addListenerOnPermissionsRemoved(this.notifyChange);
        await this.notifyChange();
    }

    private notifyChange = async (): Promise<void> => {
        let payload: boolean;

        try {
            payload = await this.browserAdapter.containsPermissions(allUrlAndFilePermissions);
        } catch (error) {
            payload = false;
            this.logger.log('Error occurred while checking browser permissions');
        } finally {
            const message: Message = {
                messageType: Messages.PermissionsState.SetPermissionsState,
                payload: payload,
                tabId: null,
            };

            this.interpreter.interpret(message);
        }
    };
}
