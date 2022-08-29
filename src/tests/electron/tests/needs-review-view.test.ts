// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { getNarrowModeThresholdsForUnified } from 'common/narrow-mode-thresholds';
import { createApplication } from 'tests/electron/common/create-application';
import { ResultsViewSelectors } from 'tests/electron/common/element-identifiers/results-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { ResultsViewController } from 'tests/electron/common/view-controllers/results-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/setup-mock-adb/setup-mock-adb';

describe('NeedsReviewView', () => {
    let app: AppController;
    let resultsViewController: ResultsViewController;
    const width = getNarrowModeThresholdsForUnified().collapseHeaderAndNavThreshold + 5;
    const height = 1000;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );

        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.client.setViewportSize({ width, height });
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        await openNeedsReview();
        await app.waitForTitle('Accessibility Insights for Android - Needs review');
    });

    it('displays needs review results with 5 failing results (results_v2)', async () => {
        await openNeedsReview();
        const cardsView = resultsViewController.createCardsViewController();
        await cardsView.waitForRuleGroupCount(1);
        expect(await cardsView.queryRuleGroupContents()).toHaveLength(0);
        await cardsView.waitForHighlightBoxCount(5);

        await cardsView.toggleRuleGroupAtPosition(1);
        await cardsView.assertExpandedRuleGroup(1, 'TextContrastCheck', 5);

        expect(await cardsView.queryRuleGroupContents()).toHaveLength(1);
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await openNeedsReview();
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('export report button does not exist', async () => {
        await openNeedsReview();
        await resultsViewController.waitForSelectorToDisappear(
            ResultsViewSelectors.exportReportButton,
        );
    });

    async function openNeedsReview(): Promise<void> {
        resultsViewController = await app.openResultsView();
        await resultsViewController.clickLeftNavItem('needs-review');
    }
});
