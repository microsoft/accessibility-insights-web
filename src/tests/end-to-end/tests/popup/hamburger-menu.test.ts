// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Popup -> Hamburger menu', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);
    });

    afterAll(async () => {
        await browser?.close();
    });

    it.each([true, false])(
        'should have content matching snapshot when quickAssess feature flag is %s',
        async quickAssessFeatureFlag => {
            const backgroundPage = await browser.background();
            quickAssessFeatureFlag === true
                ? await backgroundPage.enableFeatureFlag('quickAssess')
                : await backgroundPage.disableFeatureFlag('quickAssess');
            const button = await popupPage.getSelectorElement(
                popupPageElementIdentifiers.hamburgerMenuButton,
            );
            const menuCalloutId = await button.evaluate(element =>
                element.getAttribute('aria-controls'),
            );

            const hamburgerMenu = await formatPageElementForSnapshot(
                popupPage,
                `#${menuCalloutId}`,
            );
            expect(hamburgerMenu).toMatchSnapshot();
        },
    );

    it.each`
        highContrastMode | quickAssessFeatureFlag
        ${true}          | ${false}
        ${true}          | ${true}
        ${false}         | ${true}
        ${false}         | ${false}
    `(
        'should pass accessibility validation with highContrastMode=%s and quickAssessFeatureFlag=%s',
        async ({ highContrastMode, quickAssessFeatureFlag }) => {
            await browser.setHighContrastMode(highContrastMode);
            const backgroundPage = await browser.background();
            quickAssessFeatureFlag === true
                ? await backgroundPage.enableFeatureFlag('quickAssess')
                : await backgroundPage.disableFeatureFlag('quickAssess');
            await popupPage.waitForHighContrastMode(highContrastMode);

            const button = await popupPage.getSelectorElement(
                popupPageElementIdentifiers.hamburgerMenuButton,
            );
            const menuCalloutId = await button.evaluate(element =>
                element.getAttribute('aria-controls'),
            );

            const results = await scanForAccessibilityIssues(popupPage, `#${menuCalloutId}`);
            expect(results).toMatchSnapshot();
            // has a failure for aria-required-children
            // for elements using aria-hidden=true that should be excluded
            // this is a known issue with axe-core that has been filed here:
            // https://github.com/dequelabs/axe-core/issues/3850
        },
    );
});
