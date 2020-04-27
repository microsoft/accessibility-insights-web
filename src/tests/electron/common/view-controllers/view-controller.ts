// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import { SpectronClient } from 'spectron';
import { DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import * as WebdriverIO from 'webdriverio';
import { screenshotOnError } from '../../../end-to-end/common/screenshot-on-error';

export abstract class ViewController {
    constructor(protected client: SpectronClient) {}

    public async waitForSelector(
        selector: string,
        timeout: number = DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS,
    ): Promise<void> {
        // Note: we're intentionally not using waitForVisible here because it has different
        // semantics than Puppeteer; in particular, it requires the element be in the viewport
        // but doesn't scroll the page to the element, so it's easy for it to fail in ways that
        // are dependent on the test environment.
        await this.screenshotOnError(async () => this.client.waitForExist(selector, timeout));
    }

    public async waitForSelectorToDisappear(
        selector: string,
        timeout: number = DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS,
    ): Promise<void> {
        await this.screenshotOnError(async () =>
            this.client.waitUntil(
                async () => {
                    const selected = await this.client.$(selector);
                    return selected.value === null;
                },
                timeout,
                `was expecting element by selector ${selector} to disappear`,
            ),
        );
    }

    // You should avoid using this in most cases!
    //
    // This should only be used for cases where the product's intended functionality involves a
    // time-based delay (eg, a UI element animates in before becoming active), NOT sprinkled in
    // randomly in the hopes that it improves reliability.
    public async waitForMilliseconds(durationInMilliseconds: number): Promise<void> {
        await this.client.pause(durationInMilliseconds);
    }

    public async click(selector: string): Promise<void> {
        await this.screenshotOnError(async () => this.client.click(selector));
    }

    public async keys(keys: string): Promise<void> {
        await this.client.keys(keys);
    }

    public async isEnabled(selector: string): Promise<boolean> {
        return await this.screenshotOnError(async () => this.client.isEnabled(selector));
    }

    public async findElement(
        selector: string,
    ): Promise<WebdriverIO.RawResult<WebdriverIO.Element>> {
        return this.client.$(selector);
    }

    public async findElements(
        selector: string,
    ): Promise<WebdriverIO.RawResult<WebdriverIO.Element>[]> {
        return await this.client.$$(selector);
    }

    private async screenshotOnError<T>(wrappedFunction: () => Promise<T>): Promise<T> {
        return await screenshotOnError(
            path =>
                this.client.browserWindow
                    .capturePage()
                    .then(buffer => fs.writeFileSync(path, buffer)),
            wrappedFunction,
        );
    }

    public async executeAsync(
        script: string | ((...args: any[]) => void),
        ...args: any[]
    ): Promise<any> {
        return this.client.executeAsync(script, args);
    }

    public async execute(
        script: string | ((...args: any[]) => void),
        ...args: any[]
    ): Promise<any> {
        return this.client.execute(script, args);
    }

    public async getText(selector?: string): Promise<string> {
        return this.client.getText(selector);
    }

    public async getAttribute(selector: string, attribute: string): Promise<string> {
        return this.client.getAttribute(selector, attribute);
    }
}
