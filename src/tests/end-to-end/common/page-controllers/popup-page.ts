// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { popupPageElementIdentifiers } from '../element-identifiers/popup-page-element-identifiers';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../timeouts';
import { Page, PageOptions } from './page';

export class PopupPage extends Page {
    constructor(underlyingPage: Playwright.Page, options?: PageOptions) {
        super(underlyingPage, options);
    }

    public async enableToggleByAriaLabel(ariaLabel: string): Promise<void> {
        const toggleSelector = `button[aria-label="${ariaLabel}"]`;
        const enabledToggleSelector = `${toggleSelector}[aria-checked=true]`;
        const disabledToggleSelector = `${toggleSelector}[aria-checked=false]`;

        await this.clickSelector(disabledToggleSelector);

        // The toggles will go through a state where they are removed and replaced with a spinner, then re-added to the page
        // We intentionally omit looking for the loading spinner because it can be fast enough to not be seen by Playwright

        await this.waitForSelector(enabledToggleSelector, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });
    }

    public async gotoAdhocPanel(): Promise<void> {
        await this.clickSelector(popupPageElementIdentifiers.gotoAdhocToolsButton);
        await this.verifyAdhocPanelLoaded();
    }

    public async verifyAdhocPanelLoaded(): Promise<void> {
        await this.waitForSelector(popupPageElementIdentifiers.adhocPanel);
    }

    public async verifyLaunchPadLoaded(): Promise<void> {
        await this.waitForSelector(popupPageElementIdentifiers.launchPad);
    }
}

export function popupPageRelativeUrl(targetTabId: number): string {
    return `popup/popup.html?tabId=${targetTabId}`;
}
