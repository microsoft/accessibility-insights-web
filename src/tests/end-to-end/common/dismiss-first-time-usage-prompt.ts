// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from './browser';
import { popupPageSelectors } from './selectors/popup-page-selectors';

export async function dismissFirstTimeUsagePrompt(browser: Browser) {
    const targetPage = await browser.newTestResourcePage('all.html');

    await targetPage.bringToFront();

    const targetPageId = await browser.getActivePageTabId();
    const popupPage = await browser.newExtensionPopupPage(targetPageId);

    await popupPage.clickSelector(popupPageSelectors.startUsingProductButton);

    await targetPage.close();
    await popupPage.close();
}
