// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TargetPageInjectedComponentSelectors } from '../../common/element-identifiers/target-page-selectors';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page visualization boxes', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();
    });

    afterEach(async () => {
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }
    });

    const adhocTools = ['Landmarks', 'Headings', 'Automated checks'];

    it.each(adhocTools)(
        'for adhoc tool "%s" should pass accessibility validation',
        async adhocTool => {
            await popupPage.enableToggleByAriaLabel(adhocTool);

            await targetPage.waitForSelectorInShadowRoot(
                TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
                { state: 'attached' },
            );

            const results = await scanForAccessibilityIssues(
                targetPage,
                TargetPageInjectedComponentSelectors.insightsRootContainer,
            );
            expect(results).toHaveLength(0);
        },
    );
});
