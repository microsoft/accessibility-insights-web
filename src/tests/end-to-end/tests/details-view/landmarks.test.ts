// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from 'tests/end-to-end/common/browser';
import { launchBrowser } from 'tests/end-to-end/common/browser-factory';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';

describe('Details View -> Assessment -> Landmarks', () => {
    let browser: Browser;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
    });

    afterEach(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe('Primary content', () => {
        it('should automatically pass against a target page with no landmarks', async () => {
            const { detailsViewPage } = await browser.newAssessment({
                testResourcePath: 'landmarks/no-landmarks.html',
            });
            await detailsViewPage.navigateToTest('Landmarks');
            await detailsViewPage.navigateToRequirement('Primary content');

            await detailsViewPage.waitForRequirementStatus('Primary content', 'Passed', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
        });

        it('should not automatically pass against a target page with any landmarks', async () => {
            const { detailsViewPage } = await browser.newAssessment({
                testResourcePath: 'landmarks/mixed-landmarks.html',
            });
            await detailsViewPage.navigateToTest('Landmarks');
            await detailsViewPage.navigateToRequirement('Primary content');

            await detailsViewPage.waitForVisualHelperState('Off', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
            await detailsViewPage.waitForRequirementStatus('Primary content', 'Incomplete');
        });

        it('should visualize main landmarks', async () => {
            const { detailsViewPage, targetPage } = await browser.newAssessment({
                testResourcePath: 'landmarks/mixed-landmarks.html',
            });
            await detailsViewPage.navigateToTest('Landmarks');
            await detailsViewPage.navigateToRequirement('Primary content');
            await detailsViewPage.setToggleState('button[aria-label="Visual helper"]', true);

            await targetPage.bringToFront();
            const visualization = await targetPage.waitForVisualizationBox();
            const visualizationLabel = await targetPage.getInnerText(visualization);
            expect(visualizationLabel).toBe('main LM');
        });
    });
});
