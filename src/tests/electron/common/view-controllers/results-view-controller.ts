// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { ResultsViewSelectors } from 'tests/electron/common/element-identifiers/results-view-selectors';
import { ScreenshotViewSelectors } from 'tests/electron/common/element-identifiers/screenshot-view-selectors';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { settingsPanelSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { ViewController } from './view-controller';

export class ResultsViewController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async waitForViewVisible(): Promise<void> {
        await this.waitForSelector(ResultsViewSelectors.mainContainer);
    }

    public async waitForScreenshotViewVisible(): Promise<void> {
        await this.waitForSelector(ScreenshotViewSelectors.screenshotView);
    }

    public async openSettingsPanel(): Promise<void> {
        await this.waitForSelector(ResultsViewSelectors.settingsButton);
        await this.click(ResultsViewSelectors.settingsButton);
        await this.waitForSelector(settingsPanelSelectors.settingsPanel);
        await this.waitForMilliseconds(750); // Allow for fabric's panel animation to settle
    }

    public async clickLeftNavItem(key: LeftNavItemKey): Promise<void> {
        const selector = this.getSelectorForLeftNavItemLink(key);
        await this.waitForSelector(selector);
        await this.click(selector);
    }

    private getSelectorForLeftNavItemLink(key: LeftNavItemKey): string {
        return `${ResultsViewSelectors.leftNav} a[data-automation-id="${key}"]`;
    }

    public createAutomatedChecksViewController(): AutomatedChecksViewController {
        return new AutomatedChecksViewController(this.client);
    }
}
