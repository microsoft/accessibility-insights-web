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

    public async waitForSelectorVisible(
        selector: string,
        timeout: number = DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS,
    ): Promise<void> {
        await this.client.waitForVisible(selector, timeout);
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
