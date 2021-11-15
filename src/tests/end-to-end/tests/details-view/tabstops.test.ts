// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import {
    detailsViewSelectors,
    tabStopsSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

const tabStopsNavDataAutomationId: string = getAutomationIdSelector('TabStops');

describe('Details View -> FastPass -> TabStops', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        detailsViewPage = await openTabStopsPage(browser, targetPage);
        backgroundPage = await browser.backgroundPage();
        await backgroundPage.enableFeatureFlag(FeatureFlags.newTabStopsDetailsView);
    });

    afterAll(async () => {
        // await browser?.close();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await detailsViewPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(detailsViewPage, '*');
            expect(results).toHaveLength(0);
        },
    );

    it('Shows proper options when failing a requirement', async () => {
        await detailsViewPage.waitForSelector(tabStopsSelectors.tabStopsFailRadioButton);
        await detailsViewPage.clickSelector(tabStopsSelectors.tabStopsFailRadioButton);
        //should click the fail button but doesn't seem to be working currently
    });
});

async function openTabStopsPage(
    browser: Browser,
    targetPage: TargetPage,
): Promise<DetailsViewPage> {
    const detailsViewPage = await browser.newDetailsViewPage(targetPage);
    await detailsViewPage.switchToFastPass();
    await detailsViewPage.waitForSelector(tabStopsNavDataAutomationId);
    await detailsViewPage.clickSelector(tabStopsNavDataAutomationId);

    return detailsViewPage;
}
