// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Popup -> end-of-life message', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.waitForSelector(popupPageElementIdentifiers.endOfLifePanel);
    });

    afterAll(async () => {
        await browser?.close();
    });

    it('content should match snapshot', async () => {
        const element = await formatPageElementForSnapshot(
            popupPage,
            popupPageElementIdentifiers.endOfLifePanel,
        );
        expect(element).toMatchSnapshot();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await popupPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toHaveLength(0);
        },
    );
});
