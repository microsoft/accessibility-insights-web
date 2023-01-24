// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Popup -> Launch Pad', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
    });

    afterAll(async () => {
        await browser?.close();
    });

    it.each([true, false])(
        'content should match snapshot when quick assess feature flag is %s',
        async quickAssessFeatureFlag => {
            const backgroundPage = await browser.background();
            quickAssessFeatureFlag === true
                ? await backgroundPage.enableFeatureFlag('quickAssess')
                : await backgroundPage.disableFeatureFlag('quickAssess');
            const element = await formatPageElementForSnapshot(
                popupPage,
                popupPageElementIdentifiers.launchPad,
            );
            expect(element).toMatchSnapshot();
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
            const backgroundPage = await browser.background();
            quickAssessFeatureFlag === true
                ? await backgroundPage.enableFeatureFlag('quickAssess')
                : await backgroundPage.disableFeatureFlag('quickAssess');
            await browser.setHighContrastMode(highContrastMode);
            await popupPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toHaveLength(0);
        },
    );
});
