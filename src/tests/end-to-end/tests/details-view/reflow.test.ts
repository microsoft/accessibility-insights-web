// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundContext } from 'tests/end-to-end/common/page-controllers/background-context';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> Quick Assess -> Reflow', () => {
    let browser: Browser;
    let reflowPage: DetailsViewPage;
    let backgroundPage: BackgroundContext;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });

        backgroundPage = await browser.background();
        await backgroundPage.enableFeatureFlag('quickAssess');
        reflowPage = (await browser.newQuickAssess()).detailsViewPage;
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Requirement page', () => {
        beforeAll(async () => {
            await reflowPage.navigateToRequirement('Reflow');
        });

        afterAll(async () => {
            await reflowPage.closeNavTestLink('Reflow');
        });

        it.each([true, false])(
            'should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await reflowPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    reflowPage,
                    detailsViewSelectors.mainContent,
                );

                expect(results.length).toBe(0);
            },
        );
    });
});
