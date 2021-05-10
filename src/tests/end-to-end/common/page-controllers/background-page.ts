// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsWindowExtensions } from 'common/insights-window-extensions';
import * as Playwright from 'playwright';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import { Page, PageOptions } from './page';

declare let window: Window & InsightsWindowExtensions;

// We can't use the default polling behavior of waitForFunction with the background page
// because it is based on animation frames, which don't run in the background page.
const POLLING_INTERVAL_MS = 50;

export class BackgroundPage extends Page {
    public async waitForInitialization(): Promise<void> {
        await this.underlyingPage.waitForFunction(
            () => {
                const initialized = window.insightsUserConfiguration != null;
                return initialized;
            },
            null,
            { timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS, polling: POLLING_INTERVAL_MS },
        );
    }

    public async setHighContrastMode(enableHighContrast: boolean): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(enable => {
            window.insightsUserConfiguration.setHighContrastMode(enable);
        }, enableHighContrast);
    }

    public async setTelemetryState(enableTelemetry: boolean): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(enable => {
            window.insightsUserConfiguration.setTelemetryState(enable);
        }, enableTelemetry);
    }

    public async enableFeatureFlag(flag: string): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(flag => {
            window.insightsFeatureFlags.enableFeature(flag);
        }, flag);
    }

    constructor(underlyingPage: Playwright.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }
}

export function hasBackgroundPageUrl(page: Playwright.Page): boolean {
    return isBackgroundPageUrl(page.url());
}

export function isBackgroundPageUrl(url: string): boolean {
    return new URL(url).pathname === '/background/background.html';
}
