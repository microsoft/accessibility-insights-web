// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { TargetPageController } from 'background/target-page-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import type { Tabs } from 'webextension-polyfill';

export class TabEventDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageController: TargetPageController,
        private readonly detailsViewController: ExtensionDetailsViewController,
    ) {}

    public initialize() {
        this.browserAdapter.addListenerToWebNavigationUpdated(this.onTabNavigated);
        this.browserAdapter.addListenerToTabsOnRemoved(this.onTabRemoved);
        this.browserAdapter.addListenerOnWindowsFocusChanged(this.onWindowFocusChanged);
        this.browserAdapter.addListenerToTabsOnActivated(this.onTabActivated);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onTabUpdated);
    }

    private onTabNavigated = async (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ): Promise<void> => {
        await this.targetPageController.onTabNavigated(details);
    };

    private onTabRemoved = async (
        tabId: number,
        removeInfo: Tabs.OnRemovedRemoveInfoType,
    ): Promise<void> => {
        await this.targetPageController.onTargetTabRemoved(tabId);
        await this.detailsViewController.onRemoveTab(tabId);
    };

    private onWindowFocusChanged = async (windowId: number): Promise<void> => {
        await this.targetPageController.onWindowFocusChanged();
    };

    private onTabActivated = async (activeInfo: Tabs.OnActivatedActiveInfoType): Promise<void> => {
        await this.targetPageController.onTabActivated(activeInfo);
    };

    private onTabUpdated = async (
        tabId: number,
        changeInfo: Tabs.OnUpdatedChangeInfoType,
        tab: Tabs.Tab,
    ): Promise<void> => {
        await this.targetPageController.onTabUpdated(tabId, changeInfo);
        await this.detailsViewController.onUpdateTab(tabId, changeInfo);
    };
}
