// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TargetPageInjectedComponentSelectors } from '../../common/element-identifiers/target-page-selectors';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page issue dialog', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
    });

    afterAll(async () => {
        await 
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }();
    });

    it('should pass accessibility validation', async () => {
        await popupPage.gotoAdhocPanel();
        await popupPage.enableToggleByAriaLabel('Automated checks');

        await targetPage.clickSelectorInShadowRoot(
            TargetPageInjectedComponentSelectors.failureLabel,
        );
        await targetPage.waitForSelector(TargetPageInjectedComponentSelectors.issueDialog);

        const results = await scanForAccessibilityIssues(
            targetPage,
            TargetPageInjectedComponentSelectors.issueDialog,
        );
        expect(results).toHaveLength(0);
    });
});
