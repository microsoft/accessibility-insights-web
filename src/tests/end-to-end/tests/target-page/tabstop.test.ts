// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';

import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TabStopShadowDomSelectors, TargetPageInjectedComponentSelectors } from '../../common/element-identifiers/target-page-selectors';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('tabstop tests', () => {
    let browser: Browser;
    let targetPage: TargetPage;
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

    test('works when tabstop is triggered from adhoc panel', async () => {
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();
        await popupPage.enableToggleByAriaLabel('Tab stops');

        await targetPage.bringToFront();

        const shadowRoot = await targetPage.getShadowRoot();
        await targetPage.waitForDescendentSelector(shadowRoot, TargetPageInjectedComponentSelectors.tabStopVisulizationStart, {
            visible: true,
        });

        await targetPage.keyPress('Tab');
        await targetPage.keyPress('Tab');
        await targetPage.keyPress('Tab');

        await validateTabStopVisualizationOnTargetPage(shadowRoot);
    });

    async function validateTabStopVisualizationOnTargetPage(shadowRoot: ElementHandle<Element>): Promise<void> {
        const svgs = await shadowRoot.$$(TabStopShadowDomSelectors.svg);
        const ellipses = await shadowRoot.$$(TabStopShadowDomSelectors.ellipse);
        const lines = await shadowRoot.$$(TabStopShadowDomSelectors.lines);
        const texts = await shadowRoot.$$(TabStopShadowDomSelectors.text);

        // 3 tabs produce 1 svg, 2 ellipses, 1 texts and 1 line between them

        expect(svgs).toHaveLength(1);
        expect(ellipses).toHaveLength(2);
        expect(lines).toHaveLength(1);
        expect(texts).toHaveLength(1);
    }
});
