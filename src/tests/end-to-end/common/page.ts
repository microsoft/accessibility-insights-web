// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { formatHtmlForSnapshot } from './element-snapshot-formatter';
import { forceTestFailure } from './force-test-failure';
import { takeScreenshot } from './generate-screenshot';
import { DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS, DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from './timeouts';

export class Page {
    constructor(private readonly underlyingPage: Puppeteer.Page) {
        function forceEventFailure(eventDescription: string): void {
            forceTestFailure(`Puppeteer.Page '${underlyingPage.url()}' emitted ${eventDescription}`);
        }

        underlyingPage.on('error', error => {
            forceEventFailure(`'error' with stack: ${error.stack}`);
        });
        underlyingPage.on('pageerror', error => {
            forceEventFailure(`'pageerror' (console.error) with stack: ${error.stack}`);
        });
        underlyingPage.on('requestfailed', request => {
            forceEventFailure(`'requestfailed' from '${request.url()}' with errorText: ${request.failure().errorText}`);
        });
        underlyingPage.on('response', response => {
            if (response.status() >= 400) {
                forceEventFailure(
                    `'response' from '${response.url()}' with nonsuccessful status '${response.status()}: ${response.statusText()}'`,
                );
            }
        });
    }

    public async goto(url: string): Promise<void> {
        await this.screenshotOnError(async () => await this.underlyingPage.goto(url, { timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS }));
    }

    public async close(ignoreIfAlreadyClosed: boolean = false): Promise<void> {
        if (ignoreIfAlreadyClosed && this.underlyingPage.isClosed()) {
            return;
        }
        await this.screenshotOnError(async () => await this.underlyingPage.close());
    }

    public async bringToFront(): Promise<void> {
        await this.screenshotOnError(async () => await this.underlyingPage.bringToFront());
    }

    public async evaluate(fn: Puppeteer.EvaluateFn, ...args: any[]): Promise<any> {
        return await this.screenshotOnError(async () => await this.underlyingPage.evaluate(fn, ...args));
    }

    public async getMatchingElements<T>(selector: string, elementProperty: keyof Element): Promise<T[]> {
        return await this.screenshotOnError(
            async () =>
                await this.evaluate(
                    (selectorInEvaluate, elementPropertyInEvaluate) => {
                        const elements = Array.from(document.querySelectorAll(selectorInEvaluate));
                        return elements.map(element => element[elementPropertyInEvaluate]);
                    },
                    selector,
                    elementProperty,
                ),
        );
    }

    public async waitForSelector(selector: string, options?: Puppeteer.WaitForSelectorOptions): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(
            async () => await this.underlyingPage.waitForSelector(selector, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS, ...options }),
        );
    }

    public async waitForSelectorXPath(xpath: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(
            async () => await this.underlyingPage.waitForXPath(xpath, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS }),
        );
    }

    public async waitForId(id: string): Promise<Puppeteer.ElementHandle<Element>> {
        return this.waitForSelector(`#${id}`);
    }

    public async getShadowRootOfSelector(selector: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(async () =>
            (await this.underlyingPage.evaluateHandle(
                selectorInEval => document.querySelector(selectorInEval).shadowRoot,
                selector,
            )).asElement(),
        );
    }

    public async waitForSelectorToDisappear(selector: string): Promise<void> {
        await this.screenshotOnError(
            async () =>
                await this.underlyingPage.waitFor(
                    selectorInEvaluate => !document.querySelector(selectorInEvaluate),
                    { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS },
                    selector,
                ),
        );
    }

    public async clickSelector(selector: string): Promise<void> {
        const element = await this.waitForSelector(selector);
        await this.screenshotOnError(async () => {
            await element.click();
        });
    }

    public async clickSelectorXPath(xpath: string): Promise<void> {
        const element = await this.waitForSelectorXPath(xpath);
        await this.screenshotOnError(async () => {
            await element.click();
        });
    }

    public url(): URL {
        // We use target().url() instead of just url() here because:
        // * They ought to be equivalent in every case we care to test
        // * There is at least one edge case (the background page) where we've seen puppeteer
        //   mis-populating url() but not target().url() as ':'
        return new URL(this.underlyingPage.target().url());
    }

    public async keyPress(key: string): Promise<void> {
        await this.underlyingPage.keyboard.press(key);
    }

    public async getOuterHTMLOfSelector(selector: string): Promise<string> {
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.$eval(selector, el => el.outerHTML);
        });
    }

    private async screenshotOnError<T>(fn: () => Promise<T>): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            await takeScreenshot(this.underlyingPage);
            throw error;
        }
    }
}
