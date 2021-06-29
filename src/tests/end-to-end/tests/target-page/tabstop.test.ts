// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TabStopShadowDomSelectors } from '../../common/element-identifiers/target-page-selectors';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('Tab stops visualization', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
        targetPage = await browser.newTargetPage({
            testResourcePath: 'native-widgets/input-type-radio.html',
        });
    });

    afterEach(async () => {
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }
    });

    it('should show the expected visuals in the target page after enabling from popup and tabbing through target page', async () => {
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();
        await popupPage.enableToggleByAriaLabel('Tab stops');

        await targetPage.waitForShadowRoot();

        // Should highlight first element with a transparent circle
        await targetPage.keyPress('Tab');
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.svg);
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.transparentEllipse);

        // Should highlight second element with a transparent circle and change first element's
        // highlight to an opaque circle with a "1" in it, connected by a line
        await targetPage.keyPress('Tab');
        await waitForTabStopSelectors();

        // Only 2 focusable elements on this test page, so should move focus to the browser chrome
        // without changing the visualizations
        await targetPage.keyPress('Tab');
        await waitForTabStopSelectors();
    });

    async function waitForTabStopSelectors(): Promise<void> {
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.svg);
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.transparentEllipse);
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.opaqueEllipse);
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.lines);
        await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.text);
    }
});
