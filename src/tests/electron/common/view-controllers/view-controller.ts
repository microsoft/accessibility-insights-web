// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import { screenshotOnError } from '../../../end-to-end/common/screenshot-on-error';

export abstract class ViewController {
    constructor(public client: SpectronAsyncClient) {}

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

    public async isEnabled(selector: string): Promise<boolean> {
        return await this.screenshotOnError(async () => this.client.isEnabled(selector));
    }

    public async itemTextIncludesTarget(selector: string, target: string): Promise<boolean> {
        return await this.screenshotOnError(async () => {
            const itemText: string = await this.client.getText(selector);
            return itemText.includes(target);
        });
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
}
