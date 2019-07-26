// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { InsightsWindowGlobals } from '../../../../common/insights-feature-flags';
import { Page, PageOptions } from '../page';

export class BackgroundPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async setHighContrastMode(enableHighContrast: boolean): Promise<void> {
        return await this.underlyingPage.evaluate(enableHighContrastInPage => {
            (window as Window & InsightsWindowGlobals).insightsUserConfiguration.setHighContrastMode(enableHighContrastInPage);
        }, enableHighContrast);
    }

    public async setTelemetryEnabled(enableTelemetry: boolean): Promise<void> {
        return await this.underlyingPage.evaluate(enableTelemetryInPage => {
            (window as Window & InsightsWindowGlobals).insightsUserConfiguration.setTelemetryEnabled(enableTelemetryInPage);
        }, enableTelemetry);
    }
}

export function isBackgroundPageTarget(target: Puppeteer.Target): boolean {
    return target.type() === 'background_page' && isBackgroundPageUrl(target.url());
}

export function isBackgroundPageUrl(url: string): boolean {
    return new URL(url).pathname === '/background/background.html';
}
