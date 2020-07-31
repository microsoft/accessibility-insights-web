// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { includes } from 'lodash';
import * as Playwright from 'playwright';

import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import {
    PageFunction,
    WaitForSelectorOptions,
} from 'tests/end-to-end/common/playwright-option-types';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import { forceTestFailure } from '../force-test-failure';
import { screenshotOnError } from '../screenshot-on-error';
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
    constructor(protected readonly underlyingPage: Playwright.Page, options?: PageOptions) {
        function forceEventFailure(eventDescription: string): void {
            forceTestFailure(
                `Playwright.Page '${underlyingPage.url()}' emitted ${eventDescription}`,
            );
        }

        function serializeError(error: Error): string {
            return `[Error]{name: '${error.name}', message: '${error.message}', stack: '${error.stack}'}`;
        }

        underlyingPage.on('pageerror', error => {
            if (
                error.message.startsWith(
                    "TypeError: Cannot read property 'focusElement' of null",
                ) &&
                error.message.includes(
                    'office-ui-fabric-react/lib/components/Dropdown/Dropdown.base.js',
                )
            ) {
                return; // benign; caused by https://github.com/OfficeDev/office-ui-fabric-react/issues/9715
            }

            forceEventFailure(`'pageerror' (console.error): ${serializeError(error)}`);
        });
        underlyingPage.on('requestfailed', request => {
            const url = request.url();
            // Checking for 'fonts' and 'icons' in url as a workaround for #923
            if (!includes(url, 'fonts') && !includes(url, 'icons')) {
                forceEventFailure(
                    `'requestfailed' from '${url}' with errorText: ${request.failure().errorText}`,
                );
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
            await this.underlyingPage.waitForTimeout(300);
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
        // noop (not supported by Playwright)
    }

    public async evaluate<R, Arg>(fn: PageFunction<Arg, R>, arg?: Arg): Promise<R> {
        const timeout = DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS;
        // We don't wrap this in screenshotOnError because Playwright serializes evaluate() and
        // screenshot() such that screenshot() will always time out if evaluate is still running.
        const evalPromise = this.underlyingPage.evaluate<R, Arg>(fn, arg);
        return await promiseFactory.timeout(evalPromise, timeout);
    }

    public async getMatchingElements<T>(
        selector: string,
        elementProperty?: keyof Element,
    ): Promise<T[]> {
        return await this.screenshotOnError(
            async () =>
                await this.evaluate(
                    ([selectorInEvaluate, elementPropertyInEvaluate]) => {
                        const elements = Array.from(document.querySelectorAll(selectorInEvaluate));
                        return elements.map(element => element[elementPropertyInEvaluate]);
                    },
                    [selector, elementProperty],
                ),
        );
    }

    public async waitForDuration(durationMs: number): Promise<void> {
        await this.screenshotOnError(
            async () => await this.underlyingPage.waitForTimeout(durationMs),
        );
    }

    public async waitForSelector(
        selector: string,
        options?: WaitForSelectorOptions,
    ): Promise<Playwright.ElementHandle<Element>> {
        return await this.screenshotOnError(
            async () =>
                await this.underlyingPage.waitForSelector(selector, {
                    timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
                    ...options,
                }),
        );
    }

    public async waitForSelectorXPath(xpath: string): Promise<Playwright.ElementHandle<Element>> {
        return await this.screenshotOnError(
            async () =>
                await this.underlyingPage.waitForSelector(xpath, {
                    timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
                }),
        );
    }

    public async waitForId(id: string): Promise<Playwright.ElementHandle<Element>> {
        return this.waitForSelector(`#${id}`);
    }

    public async waitForSelectorToAppear(selector: string): Promise<void> {
        await this.waitForSelector(selector);
    }

    public async waitForSelectorToDisappear(selector: string): Promise<void> {
        await this.waitForSelector(selector, { state: 'detached' });
    }

    public async clickSelector(selector: string): Promise<void> {
        await this.screenshotOnError(async () => {
            await this.underlyingPage.waitForSelector(selector, {
                timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
            });
            await this.underlyingPage.hover(selector);
            await this.underlyingPage.waitForTimeout(DEFAULT_CLICK_HOVER_DELAY_MS);
            await this.underlyingPage.click(selector, { delay: DEFAULT_CLICK_MOUSEUP_DELAY_MS });
        });
    }

    public async clickElementHandle(element: Playwright.ElementHandle<Element>): Promise<void> {
        await this.screenshotOnError(async () => {
            await element.click({ delay: DEFAULT_CLICK_MOUSEUP_DELAY_MS });
        });
    }

    public async getSelectorElement(selector: string): Promise<Playwright.ElementHandle<Element>> {
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.$(selector);
        });
    }

    public async getSelectorElements(
        selector: string,
    ): Promise<Playwright.ElementHandle<Element>[]> {
        return await this.screenshotOnError(async () => {
            return await this.underlyingPage.$$(selector);
        });
    }

    public url(): URL {
        // We use mainFrame().url() instead of just url() here because:
        // * They ought to be equivalent in every case we care to test
        // * There is at least one edge case (the background page) where we've seen puppeteer
        //   mis-populating url() but not target().url() as ':', and we don't know that Playwright
        //   fixed that.
        return new URL(this.underlyingPage.mainFrame().url());
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

    public async injectScriptFile(filePath: string): Promise<void> {
        await this.screenshotOnError(async () => {
            await this.underlyingPage.addScriptTag({ path: filePath });
        });
    }

    public async setViewport(width: number, height: number): Promise<void> {
        await this.underlyingPage.setViewportSize({ width, height });
    }

    private async screenshotOnError<T>(wrappedFunction: () => Promise<T>): Promise<T> {
        return await screenshotOnError(
            path => this.underlyingPage.screenshot({ path, fullPage: true }),
            wrappedFunction,
        );
    }
}
