// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';

import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';
import { getPrintableHtmlElement, waitForElementToDisappear } from '../common/page-utils';
import { popupPageSelectors } from '../common/popup-page-selectors';
import { getTestResourceUrl } from '../common/test-resources';

describe('Adhoc Panel test', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect();

        await setupNewTargetPage();
        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
        await dismissTelemetryDialog();
        await waitForElementToDisappear(popupPage, popupPageSelectors.telemetryDialog);
    });

    afterEach(async () => {
        await extensionConnection.tearDown();
    });

    async function setupNewTargetPage() {
        targetPage = await extensionConnection.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await extensionConnection.getActivePageTabId();
    }

    async function dismissTelemetryDialog() {
        await popupPage.waitForSelector(popupPageSelectors.telemetryDialog);
        await popupPage.click(popupPageSelectors.startUsingProductButton);
    }

    it('test snapshot for launchpad', async () => {
        await popupPage.waitForSelector('#new-launch-pad');

        const element = await getPrintableHtmlElement(popupPage, '#new-launch-pad');
        expect(element).toMatchSnapshot();
    });

    it('test if text for all the links in launchpad show properly', async () => {
        const launchPadItemListText = await popupPage.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('.launch-pad-item-title'));
            const links = elements.map(element => {
                return element.textContent;
            });
            return links;
        });

        expect(launchPadItemListText.length).toBe(3);
        expect(launchPadItemListText).toEqual(['FastPass', 'Assessment', 'Ad hoc tools']);
    });
});
