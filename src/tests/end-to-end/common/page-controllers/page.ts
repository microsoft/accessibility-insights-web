// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { includes } from 'lodash';
import * as Puppeteer from 'puppeteer';

import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { generateUID } from 'common/uid-generator';
import * as makeDir from 'make-dir';
import * as path from 'path';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import { forceTestFailure } from '../force-test-failure';
import { takeScreenshot } from '../generate-screenshot';
import {
    DEFAULT_CLICK_HOVER_DELAY_MS,
    DEFAULT_CLICK_MOUSEUP_DELAY_MS,
    DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS,
    DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
} from '../timeouts';

const promiseFactory = createDefaultPromiseFactory();

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
            if (
                error.message.startsWith("TypeError: Cannot read property 'focusElement' of null") &&
                error.message.includes('office-ui-fabric-react/lib/components/Dropdown/Dropdown.base.js')
            ) {
                return; // benign; caused by https://github.com/OfficeDev/office-ui-fabric-react/issues/9715
            }

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
        await this.screenshotOnError(async () => {
            await this.underlyingPage.goto(url, { timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS });

            // This waitFor is a hack to work around a class of various different flakiness issues that generally take the form of
            // "some button had been loaded into the DOM, but when we clicked on it, nothing happened". We would prefer to use a more
            // reliable mechanism to wait for those elements being interactable; #1011 tracks adding and using such a mechanism.
            //
            // 300ms was chosen based on experimentation; it was the lowest value that reliably worked around the class of issue.
            await this.underlyingPage.waitFor(300);
        });
        await this.disableAnimations();
    }

    public async disableAnimations(): Promise<void> {
        await this.underlyingPage.mainFrame().addStyleTag({
            content: `*, ::before, ::after {
                transition-property: none !important;
                transition-duration: 0s !important;
                transition: none !important;
                animation: none !important;
                animation-duration: 0s !important;
            }`,
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
        const timeout = DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS;
        // We don't wrap this in screenshotOnError because Puppeteer serializes evaluate() and
        // screenshot() such that screenshot() will always time out if evaluate is still running.
        return await promiseFactory.timeout(this.underlyingPage.evaluate(fn, ...args), timeout);
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

    public async waitForDuration(durationMs: number): Promise<void> {
        await this.screenshotOnError(async () => await this.underlyingPage.waitFor(durationMs));
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

    public async waitForSelectorToAppear(selector: string): Promise<void> {
        await this.screenshotOnError(
            async () =>
                await this.underlyingPage.waitFor(
                    selectorInEvaluate => document.querySelector(selectorInEvaluate),
                    { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS },
                    selector,
                ),
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

    public async waitForDescendentSelector(
        parentElement: Puppeteer.ElementHandle<Element>,
        descendentSelector: string,
        options?: Puppeteer.WaitForSelectorOptions,
    ): Promise<Puppeteer.JSHandle> {
        options = {
            timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
            ...options,
        };
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.waitForFunction(
                (parent, selector) => parent.querySelector(selector),
                options,
                parentElement,
                descendentSelector,
            );
        });
    }

    public async waitForShadowRootOfSelector(selector: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(async () => {
            const shadowRootHandle = await this.underlyingPage.waitForFunction(
                selectorInEval => {
                    const container = document.querySelector(selectorInEval);
                    return container == undefined ? undefined : container.shadowRoot;
                },
                { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS },
                selector,
            );
            return shadowRootHandle.asElement();
        });
    }

    public async clickSelector(selector: string): Promise<void> {
        await this.screenshotOnError(async () => {
            await this.underlyingPage.waitForSelector(selector, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS });
            await this.underlyingPage.hover(selector);
            await this.underlyingPage.waitFor(DEFAULT_CLICK_HOVER_DELAY_MS);
            await this.underlyingPage.click(selector, { delay: DEFAULT_CLICK_MOUSEUP_DELAY_MS });
        });
    }

    public async clickSelectorXPath(xpath: string): Promise<void> {
        const element = await this.waitForSelectorXPath(xpath);
        await this.clickElementHandle(element);
    }

    public async clickDescendentSelector(
        parentElement: Puppeteer.ElementHandle<Element>,
        descendentSelector: string,
        options?: Puppeteer.WaitForSelectorOptions,
    ): Promise<void> {
        await this.waitForDescendentSelector(parentElement, descendentSelector, options);
        const element = await this.getDescendentSelectorElement(parentElement, descendentSelector);
        await this.clickElementHandle(element);
    }

    public async clickElementHandle(element: Puppeteer.ElementHandle<Element>): Promise<void> {
        await this.screenshotOnError(async () => {
            await element.click({ delay: DEFAULT_CLICK_MOUSEUP_DELAY_MS });
        });
    }

    public async getDescendentSelectorElement(
        parentElement: Puppeteer.ElementHandle<Element>,
        descendentSelector: string,
    ): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(async () => {
            return await parentElement.$(descendentSelector);
        });
    }

    public async getSelectorElement(selector: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.$(selector);
        });
    }

    public async getSelectorElements(selector: string): Promise<Puppeteer.ElementHandle<Element>[]> {
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.$$(selector);
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
        await this.screenshotOnError(async () => {
            await this.underlyingPage.keyboard.press(key);
        });
    }

    public async getOuterHTMLOfSelector(selector: string): Promise<string> {
        return await this.screenshotOnError(async () => {
            const element = await this.underlyingPage.waitForSelector(selector, {
                timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
            });
            return await this.underlyingPage.evaluate(el => el.outerHTML, element);
        });
    }

    public async waitForHighContrastMode(expectedHighContrastMode: boolean): Promise<void> {
        if (expectedHighContrastMode) {
            await this.waitForSelectorToAppear(CommonSelectors.highContrastThemeSelector);
        } else {
            await this.waitForSelectorToDisappear(CommonSelectors.highContrastThemeSelector);
        }
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

    public async injectScriptFile(filePath: string): Promise<void> {
        await this.screenshotOnError(async () => {
            await this.underlyingPage.addScriptTag({ path: filePath });
        });
    }

    public async withTracing<T>(wrappedFn: () => Promise<T>): Promise<T> {
        const tracingPath = path.resolve(__dirname, '../../../../../test-results/e2e/tracing');
        const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');
        await makeDir(tracingPath);
        const traceName = generateUID();
        const filePath = path.join(tracingPath, toFilename(`${traceName}.json`));
        const options: Puppeteer.TracingStartOptions = { path: filePath, screenshots: true };
        await this.underlyingPage.tracing.start(options);

        let retVal: T;
        try {
            retVal = await wrappedFn();
        } catch (originalError) {
            try {
                await this.underlyingPage.tracing.stop();
                // Only log this after tracing.stop succeeds!
                console.log(`Trace file (from error) is located at: ${filePath}`);
            } catch (secondaryTracingStopError) {
                console.error(
                    `withTracing: Detected an error, and then *additionally* hit a second error while trying to call tracing.stop() after the first error.\n` +
                        `withTracing: The secondary error from tracing.stop() is: ${secondaryTracingStopError.stack}\n` +
                        `withTracing: rethrowing the original error...`,
                );
            }
            throw originalError;
        }
        await this.underlyingPage.tracing.stop();

        // Only log this after tracing.stop!
        console.log(`Trace file (from success) is located at: ${filePath}`);
        return retVal;
    }
}
