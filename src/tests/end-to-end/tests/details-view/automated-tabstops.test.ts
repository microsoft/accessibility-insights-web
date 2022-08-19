// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { TabStopRequirementOrchestrator } from 'injected/analyzers/tab-stops-orchestrator';
import {
    detailsViewSelectors,
    tabStopsSelectors,
} from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import {
    TabStopShadowDomSelectors,
    TargetPageInjectedComponentSelectors,
} from 'tests/end-to-end/common/element-identifiers/target-page-selectors';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('Automated TabStops Results', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    const longRunningTabStopsTestTimeout = 40000;

    afterEach(async () => {
        await browser?.close();
    });

    test(
        'No failures are displayed when there are no tab elements',
        async () => {
            await openTabStopsPage('shadow-doms.html');

            await tabThroughPage(4);

            await detailsViewPage.setToggleState(tabStopsSelectors.visualHelperToggleButton, false);

            // No results, so results selectors shouldn't show up
            await detailsViewPage.waitForTimeout(100);
            const element = await detailsViewPage.getSelectorElement(
                tabStopsSelectors.automatedChecksResultSection,
            );
            expect(element).toBeNull();

            await verifyTargetPageVisualization(0, 0, 0, 0);
        },
        longRunningTabStopsTestTimeout,
    );

    test(
        'Detect and display out of order failures',
        async () => {
            await openTabStopsPage('tab-stops/out-of-order.html');

            await tabThroughPage(2);

            await detailsViewPage.waitForSelector(tabStopsSelectors.automatedChecksResultSection);
            await detailsViewPage.clickSelector(tabStopsSelectors.failedInstancesExpandButton);
            await detailsViewPage.waitForSelector(tabStopsSelectors.failedInstancesContent);

            const ruleDetails = await detailsViewPage.getSelectorElements(
                tabStopsSelectors.failedInstancesContent,
            );

            expect(ruleDetails).toHaveLength(2);

            await verifyTargetPageVisualization(1, 1, 2, 0);
        },
        longRunningTabStopsTestTimeout,
    );

    test(
        'Detect and display unreachable elements failures',
        async () => {
            await openTabStopsPage('tab-stops/unreachable.html');
            const tabEventCount = 5;
            await tabThroughPage(tabEventCount, true);

            await detailsViewPage.waitForSelector(tabStopsSelectors.automatedChecksResultSection);
            await detailsViewPage.clickSelector(tabStopsSelectors.failedInstancesExpandButton);
            await detailsViewPage.waitForSelector(tabStopsSelectors.failedInstancesContent);

            const ruleDetails = await detailsViewPage.getSelectorElements(
                tabStopsSelectors.failedInstancesContent,
            );

            expect(ruleDetails).toHaveLength(1);

            // The keyboard trap is triggered by an element re-receiving focus progromattically.
            // This should add another "normal" tab event.
            await verifyTargetPageVisualization(tabEventCount + 1, 1, 1, 0);
        },
        longRunningTabStopsTestTimeout,
    );

    test(
        'Detect and display failures when tabbing is not completed',
        async () => {
            await openTabStopsPage('tab-stops/unreachable.html');

            await tabThroughPage(2);

            // We should just be able to wait for the results section to come up, but there seems to be
            // a bug in playwright such that it's not recognizing focus on the details view. For now,
            // toggle the visual helper to get results.
            await detailsViewPage.setToggleState(tabStopsSelectors.visualHelperToggleButton, false);

            await detailsViewPage.waitForSelector(tabStopsSelectors.automatedChecksResultSection);
            await detailsViewPage.clickSelector(tabStopsSelectors.failedInstancesExpandButton);
            await detailsViewPage.waitForSelector(tabStopsSelectors.failedInstancesContent);

            const ruleDetails = await detailsViewPage.getSelectorElements(
                tabStopsSelectors.failedInstancesContent,
            );

            expect(ruleDetails).toHaveLength(2);

            await verifyTargetPageVisualization(0, 0, 0, 0);
        },
        longRunningTabStopsTestTimeout,
    );

    async function openTabStopsPage(testResourcePath: string) {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'all-origins',
        });
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
        await targetPage.waitForSelectorInShadowRoot(
            TargetPageInjectedComponentSelectors.insightsVisualizationContainer,
            { state: 'attached' },
        );
    }

    async function tabThroughPage(tabCount: number, waitForKeyboardTrapTimeout: boolean = false) {
        for (let i = 0; i < tabCount; i++) {
            await targetPage.keyPress('Tab');
            await targetPage.waitForSelectorInShadowRoot(TabStopShadowDomSelectors.svg);

            if (waitForKeyboardTrapTimeout) {
                await targetPage.waitForTimeout(TabStopRequirementOrchestrator.keyboardTrapTimeout);
            }
        }
    }

    async function verifyTargetPageVisualization(
        regularCount: number,
        focusCount: number,
        errorCount: number,
        missingCount: number,
    ) {
        await targetPage.waitForShadowRoot();
        const opaqueEllipses = await targetPage.getSelectorElements(
            TabStopShadowDomSelectors.opaqueEllipse,
        );
        expect(opaqueEllipses.length).toBe(regularCount + missingCount);

        const transparentEllipses = await targetPage.getSelectorElements(
            TabStopShadowDomSelectors.transparentEllipse,
        );
        expect(transparentEllipses.length).toBe(focusCount + errorCount);

        const dottedEllipses = await targetPage.getSelectorElements(
            TabStopShadowDomSelectors.dottedEllipse,
        );
        expect(dottedEllipses.length).toBe(missingCount);

        const failureLabels = await targetPage.getSelectorElements(
            TabStopShadowDomSelectors.failureLabel,
        );
        expect(failureLabels.length).toBe(errorCount + missingCount);
    }
});
