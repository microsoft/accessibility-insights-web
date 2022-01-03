// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    detailsViewSelectors,
    fastPassAutomatedChecksSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
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
        await detailsViewPage.waitForSelector(detailsViewSelectors.automatedChecksResultSection, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });

        const ruleDetails = await detailsViewPage.getSelectorElements(
            fastPassAutomatedChecksSelectors.ruleDetail,
        );
        expect(ruleDetails).toHaveLength(1);

        await detailsViewPage.clickSelector(fastPassAutomatedChecksSelectors.expandButton);
        const instanceCard = await detailsViewPage.getSelectorElements(
            fastPassAutomatedChecksSelectors.instanceCard,
        );
        expect(instanceCard).toHaveLength(1);
        const instanceCardContent = await instanceCard[0].innerText();
        expect(instanceCardContent).toContain('Element has insufficient color contrast');
        expect(instanceCardContent).toContain(
            'Use background color: #405c76 and the original foreground color: #000000 to meet a contrast ratio of 3.01:1.',
        );
    });
});
