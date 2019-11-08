// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import {
    AutomatedChecksViewSelectors,
    ScreenshotViewSelectors,
} from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
import { scanForAccessibilityIssues } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';

describe('AutomatedChecksView', () => {
    let app: AppController;
    let automatedChecksView: AutomatedChecksViewController;

    beforeEach(async () => {
        app = await createApplication();
        automatedChecksView = await app.openAutomatedChecksView();
    });

    afterEach(async () => {
        automatedChecksView = null;
        if (app != null) {
            await app.stop();
        }
    });

    it('displays automated checks results', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();

        expect(ruleGroups).toHaveLength(4);

        await assertExpandedRuleGroup(1, 'ImageViewName', 1);
        await assertExpandedRuleGroup(2, 'ActiveViewName', 2);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
        await assertExpandedRuleGroup(4, 'ColorContrast', 1);
    });

    it('supports collapsing rule groups to hide their associated failure details', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();

        expect(ruleGroups).toHaveLength(4);

        await automatedChecksView.collapseRuleGroupAtPosition(1);
        await automatedChecksView.collapseRuleGroupAtPosition(2);
        await automatedChecksView.collapseRuleGroupAtPosition(3);
        await automatedChecksView.collapseRuleGroupAtPosition(4);

        const collapsibleContentElements = await automatedChecksView.client.$$(AutomatedChecksViewSelectors.collapsibleContainerContent);

        expect(collapsibleContentElements).toHaveLength(0);
    });

    it('should not contain any accessibility issues', async () => {
        const violations = await scanForAccessibilityIssues(automatedChecksView);
        expect(violations).toStrictEqual([]);
    });

    async function assertExpandedRuleGroup(position: number, expectedTitle: string, expectedFailures: number): Promise<void> {
        const title = await automatedChecksView.client.$(AutomatedChecksViewSelectors.getRuleDetailsIdSelector(position)).getText();
        expect(title).toEqual(expectedTitle);

        const failures = await automatedChecksView.client.$$(AutomatedChecksViewSelectors.getLiFailuresSelector(position));
        expect(failures).toHaveLength(expectedFailures);
    }

    it('ScreenshotView renders screenshot image from specified source', async () => {
        await automatedChecksView.waitForScreenshotViewVisible();

        const resultExamplePath = path.join(__dirname, '../../miscellaneous/mock-axe-android/axe/result.json');
        const axeRuleResultExample = JSON.parse(fs.readFileSync(resultExamplePath, { encoding: 'utf-8' }));

        const expectedScreenshotImage = 'data:image/png;base64,' + axeRuleResultExample.axeContext.screenshot;

        const actualScreenshotImage = await automatedChecksView.element(ScreenshotViewSelectors.screenshotImage).getAttribute('src');

        expect(actualScreenshotImage).toEqual(expectedScreenshotImage);
    });

    it('ScreenshotView renders expected number/size of highlight boxes in expected positions', async () => {
        await automatedChecksView.waitForScreenshotViewVisible();

        const highlightBoxes = await automatedChecksView.client.$$(ScreenshotViewSelectors.highlightBox);

        const highlightBoxStyles: string[] = [];
        for (let i = 1; i <= highlightBoxes.length; i++) {
            highlightBoxStyles.push(
                await automatedChecksView.element(ScreenshotViewSelectors.getHighlightBoxByIndex(i)).getAttribute('style'),
            );
        }

        expect(highlightBoxes).toHaveLength(5);
        expect(highlightBoxStyles).toMatchSnapshot();
    });
});
