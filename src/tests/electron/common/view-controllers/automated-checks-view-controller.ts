// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as WebDriverIO from 'webdriverio';
import {
    AutomatedChecksViewSelectors,
    ScreenshotViewSelectors,
} from '../element-identifiers/automated-checks-view-selectors';
import { ViewController } from './view-controller';

export class AutomatedChecksViewController extends ViewController {
    constructor(client: WebDriverIO.Client<void>) {
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
}
