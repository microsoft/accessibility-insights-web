// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import { Browser } from './browser';
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

    // in some cases (eg, stylesheet links), HTML can contain absolute chrome-extension://{generated-id} paths
    // which differ between builds of the extension. This normalizes those.
    htmlString = htmlString.replace(/chrome-extension:\/\/\w+\//g, '{{EXTENSION_URL_BASE}}/');

    template.innerHTML = htmlString.trim();

    return template.content.cloneNode(true);
}
