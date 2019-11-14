// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import { detailsViewSelectors } from '../element-identifiers/details-view-selectors';
import { Page, PageOptions } from './page';

export class DetailsViewPage extends Page {
    constructor(underlyingPage: Puppeteer.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async ensureNoModals(): Promise<void> {
        await this.waitForSelectorToDisappear(CommonSelectors.anyModalDialog);
    }

    public async switchToFastPass(): Promise<void> {
        await this.ensureNoModals();

        await this.clickSelector('*[aria-label="select activity"]');
        await this.clickSelector('button[title="FastPass"]');
    }

    public async switchToAssessment(): Promise<void> {
        await this.ensureNoModals();

        await this.clickSelector('*[aria-label="select activity"]');
        await this.clickSelector('button[title="Assessment"]');
    }

    public async openSettingsPanel(): Promise<void> {
        await this.ensureNoModals();

        await this.clickSelector(detailsViewSelectors.gearButton);
        await this.clickSelector(detailsViewSelectors.settingsButton);
        await this.waitForSelector(detailsViewSelectors.settingsPanel);
    }

    public async closeSettingsPanel(): Promise<void> {
        await this.waitForSelector(detailsViewSelectors.settingsPanel);

        await this.keyPress('Escape');
        await this.waitForSelectorToDisappear(
            detailsViewSelectors.settingsPanel,
        );
    }

    public async enableHighContrast(): Promise<void> {
        await this.openSettingsPanel();

        await this.clickSelector(detailsViewSelectors.highContrastToggle);
        await this.waitForSelector(
            detailsViewSelectors.highContrastToggleCheckedStateSelector,
        );
        await this.waitForSelector(CommonSelectors.highContrastThemeSelector);

        await this.closeSettingsPanel();
    }
}

export function detailsViewRelativeUrl(targetTabId: number): string {
    return `DetailsView/detailsView.html?tabId=${targetTabId}`;
}
