// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { Download } from 'playwright';
import {
    detailsViewSelectors,
    fastPassReportSelectors,
    tabStopsSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { HtmlReportPage } from 'tests/end-to-end/common/page-controllers/html-report-page';
import { getTestResourceUrl } from 'tests/end-to-end/common/test-resources';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

const reportDownloadUrl = getTestResourceUrl('fast-pass-report.html');

describe('Details View -> FastPass -> Report', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;
    let reportPage: HtmlReportPage;
    const reportSaveAsFilePath = 'src/tests/end-to-end/test-resources/fast-pass-report.html';
    let reportDownload: Download;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'all-origins',
        });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        backgroundPage = await browser.backgroundPage();
        await backgroundPage.enableFeatureFlag(FeatureFlags.newTabStopsDetailsView);
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.waitForSelector(detailsViewSelectors.automatedChecksResultSection);
        await openTabStopsPage(detailsViewPage);
        await addTabStopsFailure(detailsViewPage);
        await detailsViewPage.waitForAndClickSelector(detailsViewSelectors.exportReportButton);
        await detailsViewPage.waitForSelector(detailsViewSelectors.singleExportToHtmlButton);
        reportDownload = await detailsViewPage.downloadExportReport(
            detailsViewSelectors.singleExportToHtmlButton,
            reportSaveAsFilePath,
        );
        reportPage = await browser.newHtmlReportPage(reportDownloadUrl);
    });

    afterAll(async () => {
        // delete GUID file auto-generated by the download
        await detailsViewPage.deleteDownloadedFile(reportDownload);
        // delete renamed HTML used to open report for testing
        await detailsViewPage.deleteFile(reportSaveAsFilePath);
        await browser?.close();
    });

    it('should pass accessibility validation', async () => {
        const results = await scanForAccessibilityIssues(reportPage, '*');
        // should be expect(results).toHaveLength(0), but because of existing accessibility issue
        // in the report, it's currently a snapshot. Once fixed we can remove the snapshot and check
        // the length of the results array instead.
        expect(results).toMatchSnapshot();
    });

    it('renders', async () => {
        await reportPage.waitForSelector(fastPassReportSelectors.reportHeaderSection);
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
