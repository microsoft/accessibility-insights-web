// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { includes } from 'lodash';
import { forceTestFailure } from '../force-test-failure';
import { takeScreenshot } from '../generate-screenshot';
import { DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS, DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from '../timeouts';

export type PageOptions = {
    onPageCrash?: () => void;
};

export class Page {
    constructor(protected readonly underlyingPage: Puppeteer.Page, options?: PageOptions) {
        function forceEventFailure(eventDescription: string): void {
            forceTestFailure(`Puppeteer.Page '${underlyingPage.url()}' emitted ${eventDescription}`);
        }

        function serializeError(error: Error): string {
            return `[Error]{name: '${error.name}', message: '${error.message}', stack: '${error.stack}'}`;
        }

        underlyingPage.on('error', error => {
            if (error.stack && error.stack.includes('Page crashed!') && options && options.onPageCrash) {
                options.onPageCrash();
            }

            forceEventFailure(`'error': ${serializeError(error)}`);
        });
        underlyingPage.on('pageerror', error => {
            forceEventFailure(`'pageerror' (console.error): ${serializeError(error)}`);
        });
        underlyingPage.on('requestfailed', request => {
            const url = request.url();
            // Checking for 'fonts' and 'icons' in url as a workaround for #923
            if (!includes(url, 'fonts') && !includes(url, 'icons')) {
                forceEventFailure(`'requestfailed' from '${url}' with errorText: ${request.failure().errorText}`);
            }
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
        await this.disableAnimations();
    }

    public async disableAnimations(): Promise<void> {
        await this.underlyingPage.evaluate(() => {
            function addDisableStyleToBody(): void {
                const disableAnimationsStyleElement = document.createElement('style');
                disableAnimationsStyleElement.type = 'text/css';
                disableAnimationsStyleElement.innerHTML = `* {
                    transition: none !important;
                    animation: none !important;
                }`;
                document.body.appendChild(disableAnimationsStyleElement);
            }
            if (document.readyState !== 'loading') {
                addDisableStyleToBody();
            } else {
                window.addEventListener('load', addDisableStyleToBody);
            }
        });
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

    public async $(selector: string): Promise<any> {
        return await this.screenshotOnError(async () => await this.underlyingPage.$(selector));
    }

    public async getMatchingElements<T>(selector: string, elementProperty?: keyof Element): Promise<T[]> {
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

    public async waitForDuration(duration: number): Promise<void> {
        await this.underlyingPage.waitFor(duration);
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

    public async takePagesScreenshot(): Promise<void> {
        await takeScreenshot(this.underlyingPage);
    }

    private async screenshotOnError<T>(fn: () => Promise<T>): Promise<T> {
        try {
            return await fn();
        } catch (originalError) {
            try {
                await takeScreenshot(this.underlyingPage);
            } catch (secondaryTakeScreenshotError) {
                console.error(
                    `screenshotOnError: Detected an error, and then *additionally* hit a second error while trying to take a screenshot of the page state after the first error.\n` +
                        `screenshotOnError: The secondary error from taking the screenshot is: ${secondaryTakeScreenshotError.stack}\n` +
                        `screenshotOnError: rethrowing the original error...`,
                );
            }
            throw originalError;
        }
    }
}
