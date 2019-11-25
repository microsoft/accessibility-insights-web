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

    afterEach(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe('navigation', () => {
        beforeEach(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true, addLocalhostToPermissions: true });
            targetPage = await browser.newTargetPage();
            popupPage = await browser.newPopupPage(targetPage);
            await popupPage.bringToFront();
        });

        it('should have launchpad link that takes us to adhoc panel & is sticky', async () => {
            await popupPage.gotoAdhocPanel();

            // verify ad hoc panel state is sticky
            targetPage = await browser.newTargetPage();
            popupPage = await browser.newPopupPage(targetPage);
            await popupPage.verifyAdhocPanelLoaded();
        });

        it('should take back to Launch pad on clicking "Back to Launch pad" link & is sticky', async () => {
            await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
            await popupPage.clickSelector(popupPageElementIdentifiers.backToLaunchPadLink);

    it.each([true, false])('should pass accessibility validation with highContrastMode=%s', async highContrastMode => {
        await browser.setHighContrastMode(highContrastMode);
        await popupPage.waitForHighContrastMode(highContrastMode);

        await popupPage.gotoAdhocPanel();

                await popupPage.enableToggleByAriaLabel(toggleAriaLabel);

                expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
            },
        );
    });

    it.each(['Automated checks', 'Landmarks', 'Headings', 'Color'])(
        'should display the pinned target page visualizations when enabling the "%s" toggle',
        async (toggleAriaLabel: string) => {
            await popupPage.bringToFront();
            await popupPage.gotoAdhocPanel();
            await popupPage.enableToggleByAriaLabel(toggleAriaLabel);

            await targetPage.bringToFront();
            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        },
    );
});
