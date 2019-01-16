// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as Puppeteer from 'puppeteer';

import { generateUID } from '../../../common/uid-generator';
import { forceTestFailure } from './force-test-failure';
import { DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS, DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from './timeouts';
import { async } from 'q';

const screenshotsPath = path.resolve(__dirname, '../failure-screenshots');

const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');

async function takeScreenshot(pageInstance) {
    mkdirp.sync(screenshotsPath);
    const screenshotName = generateUID();
    const filePath = path.join(screenshotsPath, toFilename(`${screenshotName}.png`));
    console.log(`Screenshot file is located at: ${filePath}`);
    return await pageInstance.screenshot({
        path: filePath,
        fullPage: true,
    });
}

export class Page {
    constructor(private readonly underlyingPage: Puppeteer.Page) {
        underlyingPage.on('pageerror', error => {
            forceTestFailure(`Unhandled pageerror (console.error) emitted from page '${underlyingPage.url()}': ${error}`);
        });
    }

    public async goto(url: string): Promise<void> {
        await this.screenshotOnError(async () => await this.underlyingPage.goto(url, { timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS }));
    }

    public async close(ignoreIfAlreadyClosed: boolean = false): Promise<void> {
        if (ignoreIfAlreadyClosed && this.underlyingPage.isClosed()) {
            return;
        }
        return await this.screenshotOnError(async () => await this.underlyingPage.close());
    }

    public async bringToFront(): Promise<void> {
        return await this.screenshotOnError(async () => await this.underlyingPage.bringToFront());
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

    public async waitForSelector(selector: string): Promise<Puppeteer.ElementHandle<Element>> {
        return await this.screenshotOnError(
            async () => await this.underlyingPage.waitForSelector(selector, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS }),
        );
    }

    public async waitForSelectorToDisappear(selector: string) {
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
        return await this.screenshotOnError(async () => {
            const element = await this.waitForSelector(selector);
            await element.click();
        });
    }

    public async clickSelectorXPath(xPathString: string) {
        return await this.screenshotOnError(async () => {
            const element = await this.underlyingPage.waitForXPath(xPathString, { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS });
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

    public async getPrintableHtmlElement(selector: string): Promise<Node> {
        const html = await this.underlyingPage.$eval(selector, el => el.outerHTML);
        return generateFormattedHtml(html);
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

function generateFormattedHtml(innerHTMLString: string) {
    const template = document.createElement('template');

    // office fabric generates a random class & id name which changes every time.
    // We remove the random number before snapshot comparison to avoid flakiness
    innerHTMLString = innerHTMLString.replace(/(class|id)="[\w\s-]+[\d]+"/g, (subString, args) => {
        return subString.replace(/[\d]+/g, '000');
    });

    template.innerHTML = innerHTMLString.trim();

    return template.content.cloneNode(true);
}
