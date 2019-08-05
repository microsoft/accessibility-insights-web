// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/fastpass-selectors';
import { tabStopShadowDomSelectors, TargetPageElementSelectors } from '../../common/element-identifiers/target-page-selectors';
import { Page } from '../../common/page-controllers/page';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('tabstop tests', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewpage: Page;
    let popupPage: PopupPage;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage({ testResourcePath: 'native-widgets/input-type-radio.html' });
    });

    afterEach(async () => {
        if (browser) {
            await browser.close();
        }
    });

    test('tabstop work when triggered from fastpass page', async () => {
        detailsViewpage = await browser.newDetailsViewPage(targetPage);

        await goToTabStopTest();
        await enableToggleByAriaLabel();

        await targetPage.waitForDuration(200);

        await targetPage.bringToFront();
        await targetPage.waitForSelector(TargetPageElementSelectors.targetPageNativeWidgetFirstRadio);

        const shadowRoot = await getShadowRootAfterTabStopActivation();
        await validateTabStopVisualizationOnTargetPage(shadowRoot);
    });

    test('works when tabstop is triggered from adhoc panel', async () => {
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();
        await popupPage.enableToggleByAriaLabel('Tab stops');

        await targetPage.bringToFront();
        await targetPage.waitForSelector(TargetPageElementSelectors.targetPageNativeWidgetFirstRadio);

        const shadowRoot = await getShadowRootAfterTabStopActivation();
        await validateTabStopVisualizationOnTargetPage(shadowRoot);
    });

    async function goToTabStopTest(): Promise<void> {
        await detailsViewpage.clickSelector(fastPassSelectors.tabStopNavButtonSelector);
    }

    async function enableToggleByAriaLabel(): Promise<void> {
        await detailsViewpage.clickSelector(fastPassSelectors.tabStopToggleUncheckedSelector);
        await detailsViewpage.waitForSelector(fastPassSelectors.tabStopToggleCheckedSelector);
    }

    async function getShadowRootAfterTabStopActivation(): Promise<ElementHandle<Element>> {
        await targetPage.keyPress('Tab');
        await targetPage.keyPress('Tab');
        await targetPage.keyPress('Tab');

        const shadowRoot = await targetPage.getShadowRoot();
        await targetPage.waitForDescendentSelector(shadowRoot, fastPassSelectors.tabStopVisulizationStart, { visible: true });

        return shadowRoot;
    }

    async function validateTabStopVisualizationOnTargetPage(shadowRoot: ElementHandle<Element>): Promise<void> {
        const svgs = await shadowRoot.$$(tabStopShadowDomSelectors.svg);
        const ellipses = await shadowRoot.$$(tabStopShadowDomSelectors.ellipse);
        const lines = await shadowRoot.$$(tabStopShadowDomSelectors.lines);
        const texts = await shadowRoot.$$(tabStopShadowDomSelectors.text);

        // 3 tabs produce 1 svg, 2 ellipses, 1 texts and 1 line between them

        expect(svgs).toHaveLength(1);
        expect(ellipses).toHaveLength(2);
        expect(lines).toHaveLength(1);
        expect(texts).toHaveLength(1);
    }
});
