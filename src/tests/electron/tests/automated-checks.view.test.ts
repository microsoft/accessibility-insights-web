// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Application } from 'spectron';
import { createApplication } from 'tests/electron/common/create-application';
import { dismissTelemetryOptInDialog } from 'tests/electron/common/dismiss-telemetry-opt-in-dialog';
import { AutomatedChecksViewSelectors } from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
import { CommonSelectors } from 'tests/electron/common/element-identifiers/common-selectors';
import { testResourceServerConfig } from 'tests/electron/setup/test-resource-server-config';
import { DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS } from 'tests/electron/setup/timeouts';
import * as WebDriverIO from 'webdriverio';

// spectron wraps calls to electron APIs as promises. Unfortunately, only electron typings are used,
// so tslint thinks some of the methods do not return promises.
// tslint:disable: await-promise

describe('AutomatedChecksView', () => {
    let app: Application;
    let client: WebDriverIO.Client<void>;

    beforeEach(async () => {
        app = await createApplication();
        client = app.client;
    });

    beforeEach(async () => {
        await dismissTelemetryOptInDialog(app);

        await ensureAppIsInDeviceConnectionDialog();

        // inputs the port, validate and start scanning
        await client.click(CommonSelectors.portNumber);
        await client.element(CommonSelectors.portNumber).keys(testResourceServerConfig.port.toString());

        await client.waitForEnabled(CommonSelectors.validateButton);
        await client.click(CommonSelectors.validateButton);

        await client.waitForEnabled(CommonSelectors.startButton);
        await client.click(CommonSelectors.startButton);

        // wait for automated checks view to be visible
        await client.waitForVisible(AutomatedChecksViewSelectors.mainContainer, DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS);
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await app.stop();
        }
    });

    it('show automated checks results', async () => {
        const ruleGroups = await client.$$(AutomatedChecksViewSelectors.collapsibleRuleDetailsGroup);

        expect(ruleGroups).toHaveLength(4);

        await assertExpandedRuleGroup(1, 'ImageViewName', 1);
        await assertExpandedRuleGroup(2, 'ActiveViewName', 2);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
        await assertExpandedRuleGroup(4, 'ColorContrast', 1);
    });

    it('collapse groups, hiding the failure details', async () => {
        const ruleGroups = await client.$$(AutomatedChecksViewSelectors.collapsibleRuleDetailsGroup);

        expect(ruleGroups).toHaveLength(4);

        const collapseGroup = async (position: number) => {
            await client.click(AutomatedChecksViewSelectors.getCollapseExpandButtonByGroupPosition(position));
        };

        await collapseGroup(1);
        await collapseGroup(2);
        await collapseGroup(3);
        await collapseGroup(4);

        const collapsibleContentElements = await client.$$(AutomatedChecksViewSelectors.collapsibleContainerContent);

        expect(collapsibleContentElements).toHaveLength(0);
    });

    async function assertExpandedRuleGroup(position: number, expectedTitle: string, expectedFailures: number): Promise<void> {
        const title = await client.$(AutomatedChecksViewSelectors.getRuleDetailsIdSelector(position)).getText();
        expect(title).toEqual(expectedTitle);

        const failures = await client.$$(AutomatedChecksViewSelectors.getLiFailuresSelector(position));
        expect(failures).toHaveLength(expectedFailures);
    }

    async function ensureAppIsInDeviceConnectionDialog(): Promise<void> {
        await client.waitForVisible(CommonSelectors.rootContainer, DEFAULT_WAIT_FOR_ELEMENT_TO_BE_VISIBLE_TIMEOUT_MS);
        expect(await app.webContents.getTitle()).toBe('Accessibility Insights for Mobile');
    }
});
