// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> Assessment -> Headings', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let headingsPage: DetailsViewPage;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open

        headingsPage = await browser.newDetailsViewPage(targetPage);
        await headingsPage.switchToAssessment();
        await headingsPage.navigateToTest('Headings');

        // Populating the instance table requires scanning the target page
        await headingsPage.waitForSelector(detailsViewSelectors.instanceTableTextContent, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await headingsPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(
                headingsPage,
                detailsViewSelectors.mainContent,
            );
            expect(results).toHaveLength(0);
        },
    );
});
