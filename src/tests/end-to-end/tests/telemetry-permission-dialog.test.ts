// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getTestResourceUrl } from '../common/test-resources';
import { DEFAULT_E2E_TEST_TIMEOUT_MS } from '../common/timeouts';
import { launchBrowser } from '../common/browser-factory';
import { Browser } from '../common/browser';
import { popupPageSelectors } from '../common/popup-page-selectors';
import { Page } from '../common/page';

describe('telemetry-permission-dialog', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;

    beforeEach(async () => {
        browser = await launchBrowser();

        targetPage = await browser.newPage(getTestResourceUrl('all.html'));
        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    });

    afterEach(async () => {
        await browser.stop();
    });

    it('should be dismissed by clicking the OK button', async () => {
        let launchpadPage = await browser.newPopupPageForTarget(targetPageTabId, {suppressFirstTimeTelemetryDialog: false});

        await launchpadPage.clickSelector(popupPageSelectors.startUsingProductButton);

        await launchpadPage.waitForSelectorToDisappear(popupPageSelectors.telemetryDialog);

        await launchpadPage.close();
        launchpadPage = await browser.newPopupPageForTarget(targetPageTabId, {suppressFirstTimeTelemetryDialog: false});

        await launchpadPage.waitForSelector(popupPageSelectors.launchPad);
        await launchpadPage.waitForSelectorToDisappear(popupPageSelectors.telemetryDialog);
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);

    it('should have HTML content that matches the snapshot', async () => {
        const launchpadPage = await browser.newPopupPageForTarget(targetPageTabId, {suppressFirstTimeTelemetryDialog: false});
        await launchpadPage.waitForSelector(popupPageSelectors.telemetryDialog);

        const element = await launchpadPage.getPrintableHtmlElement(popupPageSelectors.telemetryDialog);
        expect(element).toMatchSnapshot();
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);
});
