// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import {
    detailsViewSelectors,
    tabStopsSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { TabStopShadowDomSelectors } from 'tests/end-to-end/common/element-identifiers/target-page-selectors';
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('Automated TabStops Results', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;

    afterAll(async () => {
        await browser?.close();
    });

    test('Detect and display out of order failures', async () => {
        await openTabStopsPage('tab-stops/out-of-order.html');

        for (let i = 0; i < 4; i++) {
            await targetPage.keyPress('Tab');
            await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.svg);
        }

        await detailsViewPage.waitForSelector(tabStopsSelectors.automatedChecksResultSection);
        await detailsViewPage.clickSelector(tabStopsSelectors.failedInstancesExpandButton);

        const failureInstancesCard = await formatPageElementForSnapshot(
            detailsViewPage,
            tabStopsSelectors.automatedChecksResultSection,
        );

        expect(failureInstancesCard).toMatchSnapshot();
    });

    test('Detect and display unreachable elements failures', async () => {
        await openTabStopsPage('tab-stops/unreachable.html');

        for (let i = 0; i < 4; i++) {
            await targetPage.keyPress('Tab');
            await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.svg);
        }

        await detailsViewPage.waitForSelector(tabStopsSelectors.automatedChecksResultSection);
        await detailsViewPage.clickSelector(tabStopsSelectors.failedInstancesExpandButton);

        const failureInstancesCard = await formatPageElementForSnapshot(
            detailsViewPage,
            tabStopsSelectors.automatedChecksResultSection,
        );

        expect(failureInstancesCard).toMatchSnapshot();
    });

    async function openTabStopsPage(testResourcePath: string) {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'all-origins',
        });
        backgroundPage = await browser.backgroundPage();
        await backgroundPage.enableFeatureFlag('tabStopsAutomation');
        targetPage = await browser.newTargetPage({
            testResourcePath,
        });
        await browser.newPopupPage(targetPage);
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.waitForSelector(detailsViewSelectors.automatedChecksResultSection, {
            timeout: 100000,
        });
        await detailsViewPage.openTabStopsPage(detailsViewPage);
        await detailsViewPage.setToggleState(tabStopsSelectors.visualHelperToggleButton, true);
        await targetPage.waitForShadowRoot();
    }
});
