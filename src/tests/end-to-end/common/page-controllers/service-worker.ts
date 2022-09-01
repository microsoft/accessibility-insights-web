// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { setTimeout } from 'timers/promises';
import * as Playwright from 'playwright';
import { BackgroundContext } from 'tests/end-to-end/common/page-controllers/background-context';
import { Context } from 'tests/end-to-end/common/page-controllers/context';

const POLLING_INTERVAL_MS = 50;

export class ServiceWorker extends Context implements BackgroundContext {
    public async waitForInitialization(): Promise<void> {
        while (await this.evaluate(() => globalThis.insightsUserConfiguration == null, null)) {
            await setTimeout(POLLING_INTERVAL_MS);
        }
    }

    public async setHighContrastMode(enableHighContrast: boolean): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(
            enable => globalThis.insightsUserConfiguration.setHighContrastMode(enable),
            enableHighContrast,
        );
    }

    public async setTelemetryState(enableTelemetry: boolean): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(
            enable => globalThis.insightsUserConfiguration.setTelemetryState(enable),
            enableTelemetry,
        );
    }

    public async enableFeatureFlag(flag: string): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(flag => globalThis.insightsFeatureFlags.enableFeature(flag), flag);
    }

    public async disableFeatureFlag(flag: string): Promise<void> {
        await this.waitForInitialization();
        await this.evaluate(flag => globalThis.insightsFeatureFlags.disableFeature(flag), flag);
    }

    public url(): URL {
        return new URL(this.underlyingWorker.url());
    }

    constructor(private readonly underlyingWorker: Playwright.Worker) {
        super(underlyingWorker);
    }
}

export function hasServiceWorkerUrl(page: Playwright.Worker): boolean {
    return isServiceWorkerUrl(page.url());
}

export function isServiceWorkerUrl(url: string): boolean {
    return url.includes('/bundle/serviceWorker.bundle.js');
}
