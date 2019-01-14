// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';

export async function waitForElementToDisappear(page: Page, selector: string) {
    await page.waitFor(selectorInEvaluate => !document.querySelector(selectorInEvaluate), {}, selector);
}

export async function getMatchingElements<T>(page: Page, selector: string, mapFunc: (element: Element) => T): Promise<T> {
    return await page.evaluate(
        (selectorInEvaluate, mapFuncInEvaluate) => {
            const elements = Array.from(document.querySelectorAll(selectorInEvaluate));
            return elements.map(mapFuncInEvaluate);
        },
        selector,
        mapFunc,
    );
}

export async function getPrintableHtmlElement(page: Page, selector: string) {
    const html = await page.$eval(selector, el => el.outerHTML);
    return generateFormattedHtml(html);
}

function generateFormattedHtml(innerHTMLString: string) {
    const template = document.createElement('template');
    template.innerHTML = innerHTMLString.trim();
    return template.content.cloneNode(true);
}
