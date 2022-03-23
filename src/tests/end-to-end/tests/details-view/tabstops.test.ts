// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> FastPass -> TabStops', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.openTabStopsPage(detailsViewPage);
    });

    afterAll(async () => {
        await browser?.close();
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

    test('Add, Edit, and Remove a failure instance', async () => {
        const editedFailureInstanceText = 'this is an edited failure instance';
        const initialFailureInstanceText = 'this is a test failure instance';

        await detailsViewPage.addFailedTabStopsInstance(
            detailsViewPage,
            initialFailureInstanceText,
        );

        await detailsViewPage.editFailedTabStopsInstance(
            detailsViewPage,
            editedFailureInstanceText,
        );

        await detailsViewPage.removeFailedTabStopsInstance(detailsViewPage);
    });
});
