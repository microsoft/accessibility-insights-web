// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SpectronClient } from 'spectron';
import { settingsPanelSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import {
    AutomatedChecksViewSelectors,
    ScreenshotViewSelectors,
} from '../element-identifiers/automated-checks-view-selectors';
import { ViewController } from './view-controller';

export class AutomatedChecksViewController extends ViewController {
    constructor(client: SpectronClient) {
        super(client);
    }

    public async queryRuleGroups(): Promise<any[]> {
        return this.client.$$(AutomatedChecksViewSelectors.ruleGroup);
    }

    public async queryRuleGroupContents(): Promise<any[]> {
        return this.client.$$(AutomatedChecksViewSelectors.ruleContent);
    }

    public async toggleRuleGroupAtPosition(position: number): Promise<void> {
        const selector = AutomatedChecksViewSelectors.nthRuleGroupCollapseExpandButton(position);
        await this.waitForSelector(selector);
        await this.client.click(selector);
    }

    public async waitForViewVisible(): Promise<void> {
        await this.waitForSelector(AutomatedChecksViewSelectors.mainContainer);
    }

    public async waitForScreenshotViewVisible(): Promise<void> {
        await this.waitForSelector(ScreenshotViewSelectors.screenshotView);
    }

    public async openSettingsPanel(): Promise<void> {
        await this.waitForSelector(AutomatedChecksViewSelectors.settingsButton);
        await this.click(AutomatedChecksViewSelectors.settingsButton);
        await this.waitForSelector(settingsPanelSelectors.settingsPanel);
        await this.waitForMilliseconds(750); // Allow for fabric's panel animation to settle
    }

    public async setToggleState(toggleSelector: string, newState: boolean): Promise<void> {
        await this.waitForSelector(toggleSelector);
        const oldState = await this.client.getAttribute<string>(toggleSelector, 'aria-checked');

        const oldStateBool = oldState.toLowerCase() === 'true';
        if (oldStateBool !== newState) {
            await this.click(toggleSelector);
            await this.expectToggleState(toggleSelector, newState);
        }
    }

    public async expectToggleState(toggleSelector: string, expectedState: boolean): Promise<void> {
        const toggleInStateSelector = expectedState
            ? settingsPanelSelectors.enabledToggle(toggleSelector)
            : settingsPanelSelectors.disabledToggle(toggleSelector);

        await this.waitForSelector(toggleInStateSelector);
    }
}
