// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import * as WebDriverIO from 'webdriverio';

export interface ElementController {
    keys(keys: string): Promise<void>;
    getAttribute(attributeName: string): Promise<string>;
}

export abstract class ViewController {
    constructor(public client: WebDriverIO.Client<void>) {}

    public async waitForSelector(selector: string, timeout: number = DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS): Promise<void> {
        // Note: we're intentionally not using waitForVisible here because it has different
        // semantics than Puppeteer; in particular, it requires the element be in the viewport
        // but doesn't scroll the page to the element, so it's easy for it to fail in ways that
        // are dependent on the test environment.
        await this.client.waitForExist(selector, timeout);
    }

    public async click(selector: string): Promise<void> {
        await this.client.click(selector);
    }

    public async isEnabled(selector: string): Promise<boolean> {
        return await this.client.isEnabled(selector);
    }

    public findElement(selector: string): ElementController {
        return this.client.element(selector);
    }
}
