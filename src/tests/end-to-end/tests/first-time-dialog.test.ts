// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';

import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';
import { getPrintableHtmlElement, waitForElementToDisappear } from '../common/page-utils';
import { popupPageSelectors } from '../common/popup-page-selectors';
import { getTestResourceUrl } from '../common/test-resources';

describe('FirstTimeDialogTest', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect();

        await setupNewTargetPage();

        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);

        // This is important; without this, UI simulation (like click()) will time out.
        await popupPage.bringToFront();
    });

    afterEach(async () => {
        await extensionConnection.tearDown();
    });

    it('verify first time dialog content', async () => {
        await popupPage.waitForSelector(popupPageSelectors.telemetryDialog);

        const element = await getPrintableHtmlElement(popupPage, popupPageSelectors.telemetryDialog);
        expect(element).toMatchSnapshot();
    });

    it('should not show telemetry dialog after dismissed', async () => {
        await popupPage.waitForSelector(popupPageSelectors.telemetryDialog);
        await popupPage.click(popupPageSelectors.startUsingProductButton);

        await waitForElementToDisappear(popupPage, popupPageSelectors.telemetryDialog);

        // verify telemetry dialog doesn't show up in new popup
        await setupNewTargetPage();
        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);
        await popupPage.waitForSelector(popupPageSelectors.launchPad);
        await waitForElementToDisappear(popupPage, popupPageSelectors.telemetryDialog);
    });

    async function setupNewTargetPage() {
        targetPage = await extensionConnection.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await extensionConnection.getActivePageTabId();
    }
});
