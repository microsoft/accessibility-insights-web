// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { CommonSelectors, DetailsViewCommonSelectors } from '../element-identifiers/common-selectors';
import { Page, PageOptions } from './page';

export class DetailsViewPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async switchToFastPass(): Promise<void> {
        await this.clickSelector('*[aria-label="select activity"]');
        await this.clickSelector('button[title="FastPass"]');
    }

    public async switchToAssessment(): Promise<void> {
        await this.clickSelector('*[aria-label="select activity"]');
        await this.clickSelector('button[title="Assessment"]');
    }

    public async openSettingsPanel(): Promise<void> {
        await this.clickSelector(DetailsViewCommonSelectors.gearButton);
        await this.clickSelector(DetailsViewCommonSelectors.settingsButton);
    }

    public async enableHighContrast(): Promise<void> {
        await this.openSettingsPanel();

        await this.clickSelector(DetailsViewCommonSelectors.highContrastToggle);
        await this.waitForSelector(CommonSelectors.highContrastThemeSelector);
        await this.keyPress('Escape');
    }
}

export function detailsViewRelativeUrl(targetTabId: number): string {
    return `DetailsView/detailsView.html?tabId=${targetTabId}`;
}
