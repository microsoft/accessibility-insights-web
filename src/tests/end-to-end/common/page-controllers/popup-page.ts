// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { Page, PageOptions } from './page';

export class PopupPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }
}

export function popupPageRelativeUrl(targetTabId: number): string {
    return `popup/popup.html?tabId=${targetTabId}`;
}
