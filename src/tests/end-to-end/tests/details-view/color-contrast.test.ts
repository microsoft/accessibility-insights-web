// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { fastPassAutomatedChecksSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('Color Contrast Violations', () => {
    let browser: Browser;
    let targetPage: TargetPage;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'all-origins',
        });
    });

    beforeEach(async () => {
        targetPage = await browser.newTargetPage({
            testResourcePath: 'color-contrast/poor-color-contrast.html',
        });
    });

    afterEach(async () => {
        await browser?.closeAllPages();
    });

    afterAll(async () => {
        await browser?.close();
    });

    it('should provide color recommendations on contrast violation', async () => {
        await browser.newPopupPage(targetPage);
        const detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.clickSelector(fastPassAutomatedChecksSelectors.startOverButton);
        await detailsViewPage.waitForSelector(fastPassAutomatedChecksSelectors.ruleDetail, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });

        const ruleDetails = await detailsViewPage.getSelectorElements(
            fastPassAutomatedChecksSelectors.ruleDetail,
        );
        expect(ruleDetails).toHaveLength(1);

        await detailsViewPage.clickSelector(fastPassAutomatedChecksSelectors.expandButton);

        const recCard = await formatPageElementForSnapshot(
            detailsViewPage,
            fastPassAutomatedChecksSelectors.recommendationsCard,
        );

        expect(recCard).toMatchSnapshot();
    });
});
