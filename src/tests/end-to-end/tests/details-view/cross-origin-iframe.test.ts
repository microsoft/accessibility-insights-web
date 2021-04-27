// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ElementHandle } from 'playwright';
import * as testResourceServer from '../../../miscellaneous/test-resource-server/resource-server';
import { ResourceServerConfig } from '../../../miscellaneous/test-resource-server/resource-server-config';
import { Browser } from '../../common/browser';
import { ExtraPermissions, launchBrowser } from '../../common/browser-factory';
import {
    detailsViewSelectors,
    fastPassAutomatedChecksSelectors,
} from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';

const testResourceServerConfig: ResourceServerConfig = {
    port: 9053,
    absolutePath: path.join(__dirname, '../../test-resources/'),
};

describe('scanning', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let fastPassAutomatedChecks: DetailsViewPage;

    beforeAll(() => {
        // we need a second test resource server to get cross-origin content load on the page
        testResourceServer.startServer(testResourceServerConfig);
    });

    afterAll(async () => {
        testResourceServer.stopServer(testResourceServerConfig);
    });

    describe('with localhost permissions only', () => {
        beforeAll(async () => {
            await launchFastPassWithExtraPermissions('fake-activeTab');
        });

        afterAll(async () => {
            await browser?.close();
        });

        it('does not get results from inside cross-origin iframes', async () => {
            const ruleDetails = await fastPassAutomatedChecks.getSelectorElements(
                fastPassAutomatedChecksSelectors.ruleDetail,
            );

            expect(ruleDetails).toHaveLength(2);

            const expectedCounts = {
                'frame-title': 2,
                'html-has-lang': 1,
            };

            await assertFailureCounts(ruleDetails, expectedCounts);
        });

        it('does show iframe detected warning', async () => {
            const iframeWarning = await fastPassAutomatedChecks.getSelectorElement(
                fastPassAutomatedChecksSelectors.iframeWarning,
            );

            expect(iframeWarning).not.toBeNull();
        });
    });

    describe('with all-origins permissions', () => {
        beforeAll(async () => {
            await launchFastPassWithExtraPermissions('all-origins');
        });

        afterAll(async () => {
            await browser?.close();
        });

        it('does find results from inside cross-origin iframes', async () => {
            const ruleDetails = await fastPassAutomatedChecks.getSelectorElements(
                fastPassAutomatedChecksSelectors.ruleDetail,
            );

            expect(ruleDetails).toHaveLength(4);

            const expectedCounts = {
                'frame-title': 2,
                'html-has-lang': 1,
                'image-alt': 9,
                label: 3,
            };

            await assertFailureCounts(ruleDetails, expectedCounts);
        }, 300000);

        it('does not show iframe detected warning', async () => {
            const iframeWarning = await fastPassAutomatedChecks.getSelectorElement(
                fastPassAutomatedChecksSelectors.iframeWarning,
            );

            expect(iframeWarning).toBeNull();
        }, 300000);
    });

    async function launchFastPassWithExtraPermissions(
        extraPermissions: ExtraPermissions,
    ): Promise<void> {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: extraPermissions,
        });
        targetPage = await browser.newTargetPage({
            testResourcePath: 'all-cross-origin-iframe.html',
        });
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open

        fastPassAutomatedChecks = await openAutomatedChecks();
    }

    async function openAutomatedChecks(): Promise<DetailsViewPage> {
        const detailsViewPage = await browser.newDetailsViewPage(targetPage);

        await detailsViewPage.clickSelector(fastPassAutomatedChecksSelectors.startOverButton);

        await detailsViewPage.waitForSelector(detailsViewSelectors.automatedChecksResultSection, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });

        return detailsViewPage;
    }

    async function assertFailureCounts(
        actualRuleDetails: ElementHandle<Element>[],
        expectedCounts: { [ruleName: string]: number },
    ): Promise<void> {
        for (const ruleDetail of actualRuleDetails) {
            const ruleNameElement = await ruleDetail.$(
                fastPassAutomatedChecksSelectors.cardsRuleId,
            );
            const ruleName = await fastPassAutomatedChecks.evaluate(
                element => element.innerHTML,
                ruleNameElement,
            );

            const expectedCount = expectedCounts[ruleName];

            expect(expectedCount).not.toBeNull();

            const countElement = await ruleDetail.$(fastPassAutomatedChecksSelectors.failureCount);
            const count = await fastPassAutomatedChecks.evaluate(
                element => parseInt(element.innerHTML, 10),
                countElement,
            );

            expect(count).toBe(expectedCount);
        }
    }
});
