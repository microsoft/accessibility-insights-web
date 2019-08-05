// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/common-selectors';
import { TargetPageElementSelectors } from '../../common/element-identifiers/target-page-selectors';
import { Page } from '../../common/page-controllers/page';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { Browser } from './../../common/browser';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let detailsViewpage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage({ testResourcePath: 'native-widgets/input-type-radio.html' });
            detailsViewpage = await browser.newDetailsViewPage(targetPage);

            await goToTabStopTest();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('if visualHelper is turned on after starting tabstop and pressing tabs on target page', async () => {
            await enableToggleByAriaLabel();
            await targetPage.waitForSelector(TargetPageElementSelectors.targetPageNativeWidgetFirstRadio);
            await targetPage.waitForDuration(200);

            await targetPage.bringToFront();

            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');

            const shadowRoot = await targetPage.getShadowRoot();
            await targetPage.waitForDescendentSelector(shadowRoot, fastPassSelectors.tabStopVisulizationStart, { visible: true });

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        });

        async function goToTabStopTest(): Promise<void> {
            await detailsViewpage.clickSelector(fastPassSelectors.tabStopNavButtonSelector);
        }

        async function enableToggleByAriaLabel(): Promise<void> {
            await detailsViewpage.clickSelector(fastPassSelectors.tabStopToggleUncheckedSelector);
            await detailsViewpage.waitForSelector(fastPassSelectors.tabStopToggleCheckedSelector);
        }
    });

    describe('tabstop from adhoc tools', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let popupPage: PopupPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage({ testResourcePath: 'native-widgets/input-type-radio.html' });
            popupPage = await browser.newPopupPage(targetPage);
            await popupPage.gotoAdhocPanel();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('matches snapshot when tabstop is used from adhoc panel', async () => {
            await popupPage.enableToggleByAriaLabel('Tab stops');

            await targetPage.bringToFront();

            await targetPage.waitForSelector(TargetPageElementSelectors.targetPageNativeWidgetFirstRadio);

            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');

            const shadowRoot = await targetPage.getShadowRoot();
            await targetPage.waitForDescendentSelector(shadowRoot, fastPassSelectors.tabStopVisulizationStart, { visible: true });

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        });
    });
});
