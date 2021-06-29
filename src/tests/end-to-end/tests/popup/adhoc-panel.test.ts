// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Popup -> Ad-hoc tools', () => {
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
    });

    afterEach(async () => {
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }
    });

    it('should have launchpad link that takes us to adhoc panel & is sticky', async () => {
        await popupPage.gotoAdhocPanel();

        // verify adhoc panel state is sticky
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.verifyAdhocPanelLoaded();
    });

    it('should take back to Launch pad on clicking "Back to Launch pad" link & is sticky', async () => {
        await popupPage.clickSelector(popupPageElementIdentifiers.gotoAdhocToolsButton);
        await popupPage.clickSelector(popupPageElementIdentifiers.backToLaunchPadLink);

        await popupPage.verifyLaunchPadLoaded();

        // verify adhoc panel state is sticky
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.verifyLaunchPadLoaded();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await popupPage.waitForHighContrastMode(highContrastMode);

            await popupPage.gotoAdhocPanel();

            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toHaveLength(0);
        },
    );

    it.each(['Automated checks', 'Landmarks', 'Headings', 'Color'])(
        'should display the pinned target page visualizations when enabling the "%s" toggle',
        async (toggleAriaLabel: string) => {
            await popupPage.gotoAdhocPanel();
            await popupPage.enableToggleByAriaLabel(toggleAriaLabel);

            expect(await targetPage.waitForShadowRootHtmlSnapshot()).toMatchSnapshot();
        },
    );
});
