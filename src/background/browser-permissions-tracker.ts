// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { Permissions } from 'webextension-polyfill';

export const allOriginsPattern = '*://*/*';
export const allUrlAndFilePermissions: Permissions.Permissions = { origins: [allOriginsPattern] };
export const permissionsCheckErrorMessage: string =
    'Error occurred while checking browser permissions';

export class BrowserPermissionsTracker {
    constructor(
        private browserAdapter: BrowserAdapter,
        private interpreter: Interpreter,
        private readonly logger: Logger,
    ) {}

    public async initialize(): Promise<void> {
        this.browserAdapter.addListenerOnPermissionsAdded(this.updatePermissionState);
        this.browserAdapter.addListenerOnPermissionsRemoved(this.updatePermissionState);
        await this.updatePermissionState();
    }

    private updatePermissionState = async (): Promise<void> => {
        let permissionState: boolean = false;

        try {
            permissionState =
                await this.browserAdapter.containsPermissions(allUrlAndFilePermissions);
        } catch (error) {
            this.logger.log(permissionsCheckErrorMessage);
        } finally {
            const message: Message = {
                messageType: Messages.PermissionsState.SetPermissionsState,
                payload: {
                    hasAllUrlAndFilePermissions: permissionState,
                } as SetAllUrlsPermissionStatePayload,
            };

            const response = this.interpreter.interpret(message);
            await response.result;
        }
    };
}
