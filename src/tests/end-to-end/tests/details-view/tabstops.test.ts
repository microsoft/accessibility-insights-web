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
            expect(results).toMatchSnapshot();
            // this test has been updated to expect an aria-required-children failure only
            // this is a known issue with axe-core that has been filed here: https://github.com/dequelabs/axe-core/issues/3850
            // the axe-core bug causes a failure for the FluentUI v8 DetailsList component, which we use.
            // The FluentUI tracking issue can be found here: https://github.com/microsoft/fluentui/issues/26330
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
