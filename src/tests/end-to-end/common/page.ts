// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { forceTestFailure } from './force-test-failure';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS, DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS } from './timeouts';

export interface PageClickOptions {
    waitForElementFirst: boolean;
}

export class Page {
    constructor(
        private readonly underlyingPage: Puppeteer.Page
    ) {
        underlyingPage.on('pageerror', error => {
            forceTestFailure(`Unhandled pageerror (console.error) emitted from page '${underlyingPage.url()}': ${error}`);
        });
    }

    public async goto(url: string): Promise<void> {
        await this.underlyingPage.goto(url, { timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS });
    }

    public async bringToFront(): Promise<void> {
        await this.underlyingPage.bringToFront();
    }

    public async evaluate(fn: Puppeteer.EvaluateFn, ...args: any[]): Promise<any> {
        return await this.underlyingPage.evaluate(fn, args);
    }

    public async waitForSelector(selector: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.underlyingPage.waitForSelector(selector, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS });
    }

    public async waitForSelectorToDisappear(selector: string) {
        await this.underlyingPage.waitFor(
            selectorInEvaluate => !document.querySelector(selectorInEvaluate),
            { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS },
            selector,
        );
    }

    public async click(selector: string, options?: PageClickOptions): Promise<void> {
        options = {
            waitForElementFirst: true,
            ...options,
        };

        if (options.waitForElementFirst) {
            const element = await this.waitForSelector(selector);
            await element.click();
        } else {
            await this.underlyingPage.click(selector);
        }
    }

    public url(): URL {
        // We use target().url() instead of just url() here because:
        // * They ought to be equivalent in every case we care to test
        // * There is at least one edge case (the background page) where we've seen puppeteer
        //   mis-populating url() but not target().url() as ':'
        return new URL(this.underlyingPage.target().url());
    }
}