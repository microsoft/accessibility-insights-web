// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { forceTestFailure } from './force-test-failure';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS, DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS } from './timeouts';

export class Page {
    constructor(
        private readonly underlyingPage: Puppeteer.Page,
    ) {
        underlyingPage.on('pageerror', error => {
            forceTestFailure(`Unhandled pageerror (console.error) emitted from page '${underlyingPage.url()}': ${error}`);
        });
    }

    public async goto(url: string): Promise<void> {
        await this.underlyingPage.goto(url, { timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS });
    }

    public async close(): Promise<void> {
        await this.underlyingPage.close();
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

    public async clickSelector(selector: string): Promise<void> {
        const element = await this.waitForSelector(selector);
        await element.click();
    }

    public url(): URL {
        // We use target().url() instead of just url() here because:
        // * They ought to be equivalent in every case we care to test
        // * There is at least one edge case (the background page) where we've seen puppeteer
        //   mis-populating url() but not target().url() as ':'
        return new URL(this.underlyingPage.target().url());
    }

    public async getPrintableHtmlElement(selector: string) {
        const html = await this.underlyingPage.$eval(selector, el => el.outerHTML);
        return generateFormattedHtml(html);
    }
}

function generateFormattedHtml(innerHTMLString: string) {
    const template = document.createElement('template');
    template.innerHTML = innerHTMLString.trim();
    return template.content.cloneNode(true);
}
