// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import {
    detailsViewSelectors,
    tabStopsSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
// import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> FastPass -> Report', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        backgroundPage = await browser.backgroundPage();
        await backgroundPage.enableFeatureFlag(FeatureFlags.newTabStopsDetailsView);
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.switchToFastPass();
    });

    afterAll(async () => {
        // await browser?.close();
    });

    // it.each([true, false])(
    //     'should pass accessibility validation with highContrastMode=%s',
    //     async highContrastMode => {
    //         await browser.setHighContrastMode(highContrastMode);
    //         await detailsViewPage.waitForHighContrastMode(highContrastMode);

    //         const results = await scanForAccessibilityIssues(detailsViewPage, '*');
    //         expect(results).toHaveLength(0);
    //     },
    // );

    test('Add tabstops failure instance and export', async () => {
        await openTabStopsPage(detailsViewPage);
        addTabStopsFailure(detailsViewPage);
        await detailsViewPage.waitForAndClickSelector(detailsViewSelectors.exportReportButton);
        await detailsViewPage.waitForSelector(detailsViewSelectors.SingleExportToHtmlButton);
        const download = await detailsViewPage.downloadExportReport(
            detailsViewSelectors.SingleExportToHtmlButton,
        );
        console.log('suggested file name', download.suggestedFilename());
        await detailsViewPage.deleteDownloadedFile(download);
        // await detailsViewPage.downloadExportReport;
    });
});

async function openTabStopsPage(detailsViewPage: DetailsViewPage): Promise<void> {
    await detailsViewPage.waitForAndClickSelector(tabStopsSelectors.navDataAutomationId);
}

async function addTabStopsFailure(detailsViewPage: DetailsViewPage): Promise<void> {
    const initialFailureInstanceText = 'this is a test failure instance';

    //click "Fail" radio
    await detailsViewPage.waitForAndClickSelector(tabStopsSelectors.tabStopsFailRadioButton);

    //click "+" button
    await detailsViewPage.waitForAndClickSelector(tabStopsSelectors.addFailureInstanceButton);

    //add text to TextArea in failed instances panel
    const addFailureTextArea = await detailsViewPage.waitForSelector(
        tabStopsSelectors.addFailedInstanceTextArea,
    );
    await addFailureTextArea.fill(initialFailureInstanceText);

    //click add button
    await detailsViewPage.clickSelector(tabStopsSelectors.primaryAddFailedInstanceButton);

    //check for failed instances section
    await detailsViewPage.waitForSelector(tabStopsSelectors.failedInstancesSection);

    // expand collapsible content to reveal failed instance
    await detailsViewPage.clickSelector(tabStopsSelectors.collapsibleComponentExpandToggleButton);

    //await text of failed instance
    await detailsViewPage.waitForSelector(tabStopsSelectors.instanceTableTextContent);
}
