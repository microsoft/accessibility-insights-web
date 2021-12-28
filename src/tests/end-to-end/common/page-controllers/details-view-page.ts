// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { Download } from 'playwright';
import { WaitForSelectorOptions } from 'tests/end-to-end/common/playwright-option-types';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import {
    detailsViewSelectors,
    settingsPanelSelectors,
    overviewSelectors,
} from '../element-identifiers/details-view-selectors';
import { Page, PageOptions } from './page';

export class DetailsViewPage extends Page {
    constructor(underlyingPage: Playwright.Page, options?: PageOptions) {
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

    public async closeNavTestLink(testName: string): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelectorToDisappear(detailsViewSelectors.gettingStartedNavLink);
    }

    public async navigateToTestRequirement(
        testName: string,
        requirementName: string,
    ): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelector(`//div[@name="${requirementName}"]`);
        await this.clickSelector(detailsViewSelectors.requirementNavLink(requirementName));
        await this.waitForSelector(`//h1[text()="${requirementName}"]`);
    }

    public async navigateToGettingStarted(testName: string): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelector(`//div[@name="Getting started"]`);
        await this.clickSelector(detailsViewSelectors.gettingStartedNavLink);
        await this.waitForSelector(`//h1/span[text()="${testName}"]`);
    }

    public async waitForVisualHelperState(
        state: 'On' | 'Off' | 'disabled',
        waitOptions?: WaitForSelectorOptions,
    ): Promise<void> {
        const selectorStateSuffix = {
            On: ':not([disabled])[aria-checked="true"]',
            Off: ':not([disabled])[aria-checked="false"]',
            disabled: '[disabled]',
        }[state];

        await this.waitForSelector(
            detailsViewSelectors.visualHelperToggle + selectorStateSuffix,
            waitOptions,
        );
    }

    public async waitForRequirementStatus(
        requirementName: string,
        requirementIndex: string,
        status: 'Passed' | 'Failed' | 'Incomplete',
        waitOptions?: WaitForSelectorOptions,
    ): Promise<void> {
        await this.waitForSelector(
            detailsViewSelectors.requirementWithStatus(requirementName, requirementIndex, status),
            waitOptions,
        );
    }

    public async openSettingsPanel(): Promise<void> {
        await this.ensureNoModals();

        await this.clickSelector(CommonSelectors.settingsGearButton);
        await this.clickSelector(detailsViewSelectors.settingsButton);
        await this.waitForSelector(settingsPanelSelectors.settingsPanel);
    }

    public async closeSettingsPanel(): Promise<void> {
        await this.waitForSelector(settingsPanelSelectors.settingsPanel);

        await this.clickSelector(settingsPanelSelectors.closeButton);
        await this.waitForSelectorToDisappear(settingsPanelSelectors.settingsPanel);
    }

    public async setToggleState(toggleSelector: string, newState: boolean): Promise<void> {
        const toggle = await this.waitForSelector(toggleSelector);
        const oldState = (await (await toggle.getProperty('checked')).jsonValue()) as boolean;
        if (oldState !== newState) {
            await this.clickSelector(toggleSelector);
            await this.expectToggleState(toggleSelector, newState);
        }
    }

    public async expectToggleState(toggleSelector: string, expectedState: boolean): Promise<void> {
        const toggleInStateSelector = expectedState
            ? settingsPanelSelectors.enabledToggle(toggleSelector)
            : settingsPanelSelectors.disabledToggle(toggleSelector);

        await this.waitForSelector(toggleInStateSelector);
    }

    public async openExportDropdown(): Promise<void> {
        await this.waitForSelector(overviewSelectors.exportReportButton);
        await this.clickSelector(overviewSelectors.exportReportButton);
        await this.waitForSelector(overviewSelectors.exportDropdown);
        await this.clickSelector(overviewSelectors.exportDropdown);
    }

    public async downloadExportReport(
        selector: string,
        saveAsFileName?: string,
    ): Promise<Download> {
        const [download] = await Promise.all([
            this.underlyingPage.waitForEvent('download'),
            this.clickSelector(selector),
        ]);
        if (saveAsFileName !== undefined) {
            download.saveAs(saveAsFileName);
        }
        return download;
    }

    public async getDownloadFileName(download: Download) {
        return download.suggestedFilename();
    }

    public async deleteDownloadedFile(download: Download) {
        await download.delete();
    }

    public async closeExportDialog(): Promise<void> {
        await this.keyPress('Escape');
        await this.keyPress('Escape');
    }

    public async countMenuItems(): Promise<number> {
        const menuLocator = this.underlyingPage.locator(overviewSelectors.exportReportDropdownMenu);
        return await menuLocator.locator('li').count();
    }
}

export function detailsViewRelativeUrl(targetTabId: number): string {
    return `DetailsView/detailsView.html?tabId=${targetTabId}`;
}
