// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ElementHandle } from 'puppeteer';
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import * as testResourceServer from '../../../miscellaneous/test-resource-server/resource-server';
import { ResourceServerConfig } from '../../../miscellaneous/test-resource-server/resource-server-config';
import { Browser } from '../../common/browser';
import { ExtraPermissions, launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors, fastPassAutomatedChecksSelectors } from '../../common/element-identifiers/details-view-selectors';
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
        beforeEach(async () => {
            await launchFastPassWithExtraPermissions('fake-activeTab');
        });

        afterEach(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('does not get results from inside cross-origin iframes', async () => {
            const ruleDetails = await fastPassAutomatedChecks.getSelectorElements(fastPassAutomatedChecksSelectors.ruleDetail);

            expect(ruleDetails).toHaveLength(2);

            const expectedCounts = {
                'frame-title': 2,
                'html-has-lang': 1,
            };

            await assertFailureCounts(ruleDetails, expectedCounts);
        });
    });

    describe.only('with all-origins permissions', () => {
        beforeEach(async () => {
            await launchFastPassWithExtraPermissions('all-origins');
        });

        afterEach(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('does find results from inside cross-origin iframes', async () => {
            const ruleDetails = await fastPassAutomatedChecks.getSelectorElements(fastPassAutomatedChecksSelectors.ruleDetail);

            expect(ruleDetails).toHaveLength(5);

            const expectedCounts = {
                'duplicate-id': 1,
                'frame-title': 2,
                'html-has-lang': 1,
                'image-alt': 9,
                label: 3,
            };

            await assertFailureCounts(ruleDetails, expectedCounts);
        });
    });

    async function launchFastPassWithExtraPermissions(extraPermissions: ExtraPermissions): Promise<void> {
        browser = await launchBrowser({ suppressFirstTimeDialog: true, addExtraPermissionsToManifest: extraPermissions });
        targetPage = await browser.newTargetPage({ testResourcePath: 'all-cross-origin-iframe.html' });
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open

        fastPassAutomatedChecks = await openAutomatedChecks();
        await fastPassAutomatedChecks.bringToFront();
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
            const ruleNameElement = await ruleDetail.$('[data-automation-id="cards-rule-id"]'); // update this
            const ruleName = await fastPassAutomatedChecks.evaluate(element => element.innerHTML, ruleNameElement);

            const expectedCount = expectedCounts[ruleName];

            expect(expectedCount).not.toBeNull();

            const countElement = await ruleDetail.$('.count'); // change this to use automation-id
            const count = await fastPassAutomatedChecks.evaluate(element => parseInt(element.innerHTML, 10), countElement);

            expect(count).toBe(expectedCount);
        }
    }
});
