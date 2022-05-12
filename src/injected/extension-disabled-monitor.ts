// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { PromiseFactory } from 'common/promises/promise-factory';

// The browser can set our extension to a "disabled" state in a few cases:
//
// * User uninstalls the extension
// * User disabled the extension in the "Manage Extensions" settings page
// * Extension is updated
//
// When this occurs, background pages/service workers get torn down, but
// already-injected content scripts don't; they remain active on the page
// indefinitely, but lose the ability to communicate with other extension
// pages.
//
// This class enables our injected content script to detect this case and
// perform any necessary cleanup (eg, hiding any active visualizations).
export class ExtensionDisabledMonitor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
    ) {}

    private readonly pollIntervalMs = 1000;
    private onDisabledCallback: null | Function = null;

    public async monitorUntilDisabled(onDisabledCallback: Function): Promise<void> {
        this.onDisabledCallback = onDisabledCallback;

        // Instead of polling, it would be possible to use browser.runtime.connect()
        // to open an indefinitely-lived port to the background and watch its
        // onDisconnect event.
        //
        // We avoid that because in a manifest v3 service worker, the browser treats
        // a port that remains open for too long (> 5min) like a timed out message and
        // tears down the background worker after that timeout, even if it's in the
        // middle of other work.
        await this.pollUntilDisabled();
    }

    private async pollUntilDisabled(): Promise<void> {
        while (await this.isBackgroundReachable()) {
            await this.promiseFactory.delay(null, this.pollIntervalMs);
        }

        this.logger.log('Detected extension disablement');

        this.onDisabledCallback?.();
    }

    private async isBackgroundReachable(): Promise<boolean> {
        try {
            // Ideally this would use browser.management.getSelf(), but
            // that API isn't available to content scripts.
            //
            // This could use a dispatcher instead of a browserAdapter; it
            // doesn't do so only because the error behavior is tightly
            // coupled to the browser behavior.
            await this.browserAdapter.sendRuntimeMessage({
                messageType: Messages.Common.Ping,
            });
            return true;
        } catch (error: unknown) {
            return false;
        }
    }
}
