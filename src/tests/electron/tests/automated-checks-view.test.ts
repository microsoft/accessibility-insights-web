// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import {
    AutomatedChecksViewSelectors,
    ScreenshotViewSelectors,
} from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';
import { testResourceServerConfig } from '../setup/test-resource-server-config';
describe('AutomatedChecksView', () => {
    let app: AppController;
    let automatedChecksView: AutomatedChecksViewController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        automatedChecksView = await app.openAutomatedChecksView();
        await automatedChecksView.waitForScreenshotViewVisible();
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        expect(await app.getTitle()).toBe('Accessibility Insights for Android - Automated checks');
    });

    it('displays automated checks results collapsed by default', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();
        expect(ruleGroups).toHaveLength(4);

        const collapsibleContentElements = await automatedChecksView.queryRuleGroupContents();
        expect(collapsibleContentElements).toHaveLength(0);
    });

    async function countHighlightBoxes(): Promise<number> {
        const boxes = await automatedChecksView.client.$$(ScreenshotViewSelectors.highlightBox);
        return boxes.length;
    }

    it('supports expanding and collapsing rule groups', async () => {
        expect(await countHighlightBoxes()).toBe(5);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(0);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await assertExpandedRuleGroup(1, 'ImageViewName', 1);

        await automatedChecksView.toggleRuleGroupAtPosition(2);
        await assertExpandedRuleGroup(2, 'ActiveViewName', 2);

        await automatedChecksView.toggleRuleGroupAtPosition(3);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);

        expect(await countHighlightBoxes()).toBe(4);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(3);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await assertCollapsedRuleGroup(1, 'ImageViewName');

        await automatedChecksView.toggleRuleGroupAtPosition(2);
        await assertCollapsedRuleGroup(2, 'ActiveViewName');

        expect(await countHighlightBoxes()).toBe(1);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(1);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });

    async function assertExpandedRuleGroup(
        position: number,
        expectedTitle: string,
        expectedFailures: number,
    ): Promise<void> {
        const title = await automatedChecksView.client.getText(
            AutomatedChecksViewSelectors.nthRuleGroupTitle(position),
        );
        expect(title).toEqual(expectedTitle);

        const failures = await automatedChecksView.client.$$(
            AutomatedChecksViewSelectors.nthRuleGroupInstances(position),
        );
        expect(failures).toHaveLength(expectedFailures);
    }

    async function assertCollapsedRuleGroup(
        position: number,
        expectedTitle: string,
    ): Promise<void> {
        const title = await automatedChecksView.client.getText(
            AutomatedChecksViewSelectors.nthRuleGroupTitle(position),
        );
        expect(title).toEqual(expectedTitle);

        const failures = await automatedChecksView.client.$$(
            AutomatedChecksViewSelectors.nthRuleGroupInstances(position),
        );
        expect(failures).toHaveLength(0);
    }

    it('ScreenshotView renders screenshot image from specified source', async () => {
        const resultExamplePath = path.join(
            testResourceServerConfig.absolutePath,
            'AccessibilityInsights/result.json',
        );
        const axeRuleResultExample = JSON.parse(
            fs.readFileSync(resultExamplePath, { encoding: 'utf-8' }),
        );

        const expectedScreenshotImage =
            'data:image/png;base64,' + axeRuleResultExample.axeContext.screenshot;

        const actualScreenshotImage = await automatedChecksView.client.getAttribute<string>(
            ScreenshotViewSelectors.screenshotImage,
            'src',
        );
        expect(actualScreenshotImage).toEqual(expectedScreenshotImage);
    });

    it('ScreenshotView renders expected number/size of highlight boxes in expected positions', async () => {
        await automatedChecksView.waitForScreenshotViewVisible();

        const styles = await automatedChecksView.client.getAttribute<string[]>(
            ScreenshotViewSelectors.highlightBox,
            'style',
        );

        const actualHighlightBoxStyles = styles.map(extractPositionStyles);
        verifyHighlightBoxStyles(actualHighlightBoxStyles, [
            { width: 10.7407, height: 6.04167, top: 3.28125, left: 89.2593 },
            { width: 10.7407, height: 6.04167, top: 3.28125, left: 89.2593 },
            { width: 10.7407, height: 6.04167, top: 10.4167, left: 13.4259 },
            { width: 48.6111, height: 4.94792, top: 23.5417, left: 25.6481 },
            { width: 49.8148, height: 16.4063, top: 30.1042, left: 0 },
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
});
