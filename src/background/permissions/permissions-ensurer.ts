// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

export class PermissionsEnsurer {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public async ensureInjectPermissions(tabId: number): Promise<boolean> {
        const hasPermissions = await this.hasPermissions(tabId);

        if (!hasPermissions) {
            return this.requestPermissions(tabId);
        }

        return true;
    }

    private async hasPermissions(tabId: number): Promise<boolean> {
        try {
            // we try to inject a simple script to check if we have permissions to do so
            // the main reason to not use chrome.permissions.contains is our main scenario to inject js/css
            // into the target page is when the user explicitly activate our extension (by clicking our icon or using
            // the shortcut). In this case, we are using the "activeTab" permission (from the manifest) which
            // is not cover by chrome.permissions.contains (basically, you won't see either the origin of the target page,
            // not the "activeTab" permission on the result).
            await this.browserAdapter.executeScriptInTab(tabId, {
                // this script "evaluates to itself", i.e. the result is the string: "injected"
                // this way we don't change anything on the page but still can check we have permissions to inject js
                code: '"injected"',
            });

            return true;
        } catch (error) {
            if (error.message.endsWith('Extension manifest must request permission to access this host.')) {
                return false;
            }

            throw error;
        }
    }

    private requestPermissions(tabId: number): Promise<boolean> {
        return new Promise(resolve => {
            this.browserAdapter.getTab(tabId, tab => {
                const tabUrl = new URL(tab.url);
                const permissionsToRequest = {
                    origins: [`${tabUrl.origin}/`],
                };

                return this.browserAdapter.requestPermissions(permissionsToRequest).then(resolve);
            });
        });
    }
}
