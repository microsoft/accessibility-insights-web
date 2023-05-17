// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { PromiseFactory } from 'common/promises/promise-factory';

// The browser can set our extension to a "disabled" state in a few cases:
//
// * User uninstalls the extension
// * User disabled the extension in the "Manage Extensions" settings page
// * Extension is updated
//
// When this occurs, background service workers get torn down, but
// already-injected content scripts don't; they remain active on the page
// indefinitely, but lose the ability to communicate with other extension
// pages.
//
// This class enables our injected content script to detect this case and
// perform any necessary cleanup (eg, hiding any active visualizations).
export class ExtensionDisabledMonitor {
    private readonly pollIntervalMs = 1000;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
    ) {}

    public async monitorUntilDisabled(onDisabledCallback: Function): Promise<void> {
        while (this.isExtensionContextAvailable()) {
            await this.promiseFactory.delay(null, this.pollIntervalMs);
        }

        this.logger.log('Detected extension disablement');

        onDisabledCallback();
    }

    private isExtensionContextAvailable(): boolean {
        return this.browserAdapter.getExtensionId() != null;
    }
}
