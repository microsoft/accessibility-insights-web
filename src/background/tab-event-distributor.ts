// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { TargetPageController } from 'background/target-page-controller';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';

export class TabEventDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetPageController: TargetPageController,
        private readonly detailsViewController: ExtensionDetailsViewController,
    ) {}

    public initialize() {
        this.browserAdapter.addListenerOnConnect(port => {
            // do not remove this. We need this to detect if the extension is reloaded from the content scripts
        });

        this.browserAdapter.addListenerToWebNavigationUpdated(this.onTabNavigated);
        this.browserAdapter.addListenerToTabsOnRemoved(this.onTabRemoved);
        this.browserAdapter.addListenerOnWindowsFocusChanged(this.onWindowFocusChanged);
        this.browserAdapter.addListenerToTabsOnActivated(this.onTabActivated);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onTabUpdated);
    }

    private onTabNavigated = async (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ): Promise<void> => {
        //TODO: implement
    };

    private onTabRemoved = async (
        tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo,
    ): Promise<void> => {
        //TODO: implement
    };

    private onWindowFocusChanged = async (windowId: number): Promise<void> => {
        //TODO: implement
    };

    private onTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo): Promise<void> => {
        //TODO: implement
    };

    private onTabUpdated = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
    ): Promise<void> => {
        //TODO: implement
    };
}
