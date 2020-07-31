// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { CommonSelectors } from '../element-identifiers/common-selectors';
import {
    detailsViewSelectors,
    settingsPanelSelectors,
} from '../element-identifiers/details-view-selectors';
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

    public async closeNavTestLink(testName: string): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelectorToDisappear(detailsViewSelectors.gettingStartedNavLink);
    }

    public async navigateToTestRequirement(
        testName: string,
        requirementName: string,
    ): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelectorXPath(`//div[@name="${requirementName}"]`);
        await this.clickSelector(detailsViewSelectors.requirementNavLink(requirementName));
        await this.waitForSelectorXPath(`//h1[text()="${requirementName}"]`);
    }

    public async navigateToGettingStarted(testName: string): Promise<void> {
        await this.clickSelector(detailsViewSelectors.testNavLink(testName));
        await this.waitForSelectorXPath(`//div[@name="Getting Started"]`);
        await this.clickSelector(detailsViewSelectors.gettingStartedNavLink);
        await this.waitForSelectorXPath(`//h1/span[text()="${testName}"]`);
    }

    public async waitForVisualHelperState(
        state: 'On' | 'Off' | 'disabled',
        waitOptions?: Puppeteer.WaitForSelectorOptions,
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
        waitOptions?: Puppeteer.WaitForSelectorOptions,
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
}

export function detailsViewRelativeUrl(targetTabId: number): string {
    return `DetailsView/detailsView.html?tabId=${targetTabId}`;
}
