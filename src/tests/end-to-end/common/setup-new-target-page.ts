// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from './browser';
import { Page } from './page';

export interface TargetPageInfo {
    page: Page;
    tabId: number;
}
export async function setupNewTargetPage(browser: Browser): Promise<TargetPageInfo> {
    const targetPage = await browser.newTestResourcePage('all.html');

    await targetPage.bringToFront();
    const targetPageTabId = await browser.getActivePageTabId();
    return {
        page: targetPage,
        tabId: targetPageTabId,
    };
}
