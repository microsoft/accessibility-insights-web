// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import { Page } from './page';

export async function formatPageElementForSnapshot(page: Page, selector: string): Promise<Node> {
    const outerHtml = await page.getOuterHTMLOfSelector(selector);
    return formatHtmlForSnapshot(outerHtml);
}

export async function formatChildElementForSnapshot(rootElement: ElementHandle<Element>, childSelector: string): Promise<Node> {
    const childOuterHtml = await rootElement.$eval(childSelector, el => el.outerHTML);
    return formatHtmlForSnapshot(childOuterHtml);
}

export function formatHtmlForSnapshot(htmlString: string): Node {
    const template = document.createElement('template');

    // office fabric generates a random class & id name which changes every time.
    // We remove the random number before snapshot comparison to avoid flakiness
    htmlString = htmlString.replace(/(class|id)="[\w\s-]+[\d]+"/g, (subString, args) => {
        return subString.replace(/[\d]+/g, '000');
    });

    template.innerHTML = htmlString.trim();

    return template.content.cloneNode(true);
}
