// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { needsReviewTestConfig } from 'electron/platform/android/test-configs/needs-review/test-config';
import { TestConfig } from 'electron/types/test-config';
import { leftNavAutomationId } from 'electron/views/left-nav/left-nav';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';

export class LeftNavController {
    private leftNavSelector = getAutomationIdSelector(leftNavAutomationId);

    constructor(private readonly client: SpectronAsyncClient) {}

    public async clickNeedsReview(): Promise<void> {
        await this.clickLeftNavItem(needsReviewTestConfig);
    }

    private async clickLeftNavItem(config: TestConfig): Promise<void> {
        const selector = this.getSelectorForLeftNavItemLink(config);
        await this.client.click(selector);
    }

    private getSelectorForLeftNavItemLink(config: TestConfig): string {
        return `${this.leftNavSelector} li [name="${config.contentPageInfo.title}"] a`;
    }
}
