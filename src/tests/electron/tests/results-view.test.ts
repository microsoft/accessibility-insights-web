// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { getNarrowModeThresholdsForUnified } from 'common/narrow-mode-thresholds';
import { androidTestConfigs } from 'electron/platform/android/test-configs/android-test-configs';
import { androidScanResultExample } from 'tests/common/android-scan-result-example';
import { createApplication } from 'tests/electron/common/create-application';
import { ResultsViewSelectors } from 'tests/electron/common/element-identifiers/results-view-selectors';
import { ScreenshotViewSelectors } from 'tests/electron/common/element-identifiers/screenshot-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { ResultsViewController } from 'tests/electron/common/view-controllers/results-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/setup-mock-adb/setup-mock-adb';

describe('ResultsView', () => {
    let app: AppController;
    let resultsView: ResultsViewController;
    const narrowModeThresholds = getNarrowModeThresholdsForUnified();
    const height = 400;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should pass accessibility validation when left nav is showing', async () => {
        await app.client.setViewportSize({
            width: narrowModeThresholds.collapseCommandBarThreshold + 1,
            height,
        });
        await openResultsView();

        await resultsView.waitForSelector(ResultsViewSelectors.leftNav);
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('left nav allows to change between tests', async () => {
        const testIndex = 1;
        const expectedTestTitle = androidTestConfigs.filter(
            config => config.featureFlag === undefined,
        )[testIndex].contentPageInfo.title;

        await app.client.setViewportSize({
            width: narrowModeThresholds.collapseCommandBarThreshold + 1,
            height,
        });
        await openResultsView();
        await resultsView.waitForSelector(ResultsViewSelectors.leftNav);
        await resultsView.client.click(ResultsViewSelectors.nthTestInLeftNav(testIndex + 1));
        const title = await resultsView.client.textContent('h1');
        expect(title).toEqual(expectedTestTitle);
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await openResultsView();
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('ScreenshotView renders screenshot image from specified source for results_v2', async () => {
        await openResultsView();

        const expectedScreenshotImage =
            'data:image/png;base64,' + androidScanResultExample.AxeResults.axeContext.screenshot;

        await resultsView.waitForSelector(ScreenshotViewSelectors.screenshotImage);
        const actualScreenshotImage = await resultsView.client.getAttribute(
            ScreenshotViewSelectors.screenshotImage,
            'src',
        );

        expect(actualScreenshotImage).toEqual(expectedScreenshotImage);
    });

    it('ScreenshotView renders expected number/size of highlight boxes in expected positions for results_v2', async () => {
        await openResultsView();

        await resultsView.waitForSelector(ScreenshotViewSelectors.highlightBox);

        const boxes = await resultsView.client.$$(ScreenshotViewSelectors.highlightBox);
        const styles = await Promise.all(boxes.map(async b => await b.getAttribute('style')));
        const actualHighlightBoxStyles = styles.map(extractPositionStyles);
        verifyHighlightBoxStyles(actualHighlightBoxStyles, [
            { width: 73.6111, height: 3.42593, top: 38.7037, left: 13.1481 },
            { width: 73.6111, height: 3.42593, top: 38.7037, left: 13.1481 },
            { width: 100, height: 35.4167, top: 42.1296, left: 0 },
        ]);
    });

    type PositionStyles = {
        width: number;
        height: number;
        top: number;
        left: number;
    };

    function extractPositionStyles(styleValue: string): PositionStyles {
        return {
            width: extractStyleProperty(styleValue, 'width'),
            height: extractStyleProperty(styleValue, 'height'),
            top: extractStyleProperty(styleValue, 'top'),
            left: extractStyleProperty(styleValue, 'left'),
        };
    }

    function extractStyleProperty(styleValue: string, propertyName: string): number {
        return parseFloat(RegExp(`${propertyName}: (-?\\d+(\\.\\d+)?)%`).exec(styleValue)[1]);
    }

    function verifyHighlightBoxStyles(
        actualHighlightBoxStyles: PositionStyles[],
        expectedHighlightBoxStyles: PositionStyles[],
    ): void {
        expect(actualHighlightBoxStyles).toHaveLength(expectedHighlightBoxStyles.length);

        actualHighlightBoxStyles.forEach((boxStyle, index) => {
            expect(boxStyle.top).toBeCloseTo(expectedHighlightBoxStyles[index].top);
            expect(boxStyle.left).toBeCloseTo(expectedHighlightBoxStyles[index].left);
            expect(boxStyle.width).toBeCloseTo(expectedHighlightBoxStyles[index].width);
            expect(boxStyle.height).toBeCloseTo(expectedHighlightBoxStyles[index].height);
        });
    }

    const setupWindowForCommandBarReflowTest = async (mode: 'narrow' | 'wide'): Promise<void> => {
        const width =
            mode === 'narrow'
                ? narrowModeThresholds.collapseCommandBarThreshold - 2
                : narrowModeThresholds.collapseCommandBarThreshold;

        await app.client.setViewportSize({ width, height });
    };

    it('command bar reflows when narrow mode threshold is crossed', async () => {
        await openResultsView();
        await setupWindowForCommandBarReflowTest('narrow');
        await resultsView.waitForSelector(ResultsViewSelectors.leftNavHamburgerButton);

        await setupWindowForCommandBarReflowTest('wide');
        await resultsView.waitForSelectorToDisappear(ResultsViewSelectors.leftNavHamburgerButton);
    });

    const waitForFluentLeftNavToDisappear = async (): Promise<void> => {
        await resultsView.waitForSelectorToDisappear(ResultsViewSelectors.fluentLeftNav);
    };

    it('hamburger button click opens and closes left nav', async () => {
        await openResultsView();
        await setupWindowForCommandBarReflowTest('narrow');
        await waitForFluentLeftNavToDisappear();
        await resultsView.client.click(ResultsViewSelectors.leftNavHamburgerButton);
        await resultsView.waitForSelector(ResultsViewSelectors.fluentLeftNav);

        // Clicks the hamburger button inside the fluent left nav (there is one within the command bar as well)
        const selector = `${ResultsViewSelectors.fluentLeftNav} ${ResultsViewSelectors.leftNavHamburgerButton}`;
        await resultsView.client.click(selector);
        await waitForFluentLeftNavToDisappear();
    });

    it('left nav closes when item is selected', async () => {
        await openResultsView();
        await setupWindowForCommandBarReflowTest('narrow');
        await resultsView.client.click(ResultsViewSelectors.leftNavHamburgerButton);
        await resultsView.waitForSelector(ResultsViewSelectors.fluentLeftNav);

        const selector = `${ResultsViewSelectors.fluentLeftNav} a`;
        await resultsView.client.click(selector);
        await waitForFluentLeftNavToDisappear();
    });

    it('export report button exists', async () => {
        await openResultsView();
        await setupWindowForCommandBarReflowTest('wide');
        await resultsView.waitForSelector(ResultsViewSelectors.exportReportButton);
    });

    async function openResultsView(): Promise<void> {
        resultsView = await app.openResultsView();
        await resultsView.waitForScreenshotViewVisible();
    }
});
