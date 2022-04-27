// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import { DictionaryNumberTo } from 'types/common-types';
import { PageVisibilityChangeTabPayload } from './actions/action-payloads';
import { ExtensionDetailsViewController } from './extension-details-view-controller';
import { TabContextManager } from './tab-context-manager';

export class TargetPageController {
    constructor(
        private readonly tabContextManager: TabContextManager,
        private readonly browserAdapter: BrowserAdapter,
        private readonly detailsViewController: ExtensionDetailsViewController,
        private readonly logger: Logger,
        private readonly knownTabs: DictionaryNumberTo<string>,
        private readonly idbInstance: IndexedDBAPI,
        private persistStoreData = false,
    ) {}

    public async initialize(): Promise<void> {
        const knownTabIds: number[] = Object.keys(this.knownTabs).map(knownTab =>
            parseInt(knownTab),
        );

        knownTabIds.forEach(tabId => this.tabContextManager.addTabContextIfNotExists(tabId));

        const tabs = await this.browserAdapter.tabsQuery({});

        const removedTabs = knownTabIds.filter(
            knownTab => !tabs.map(tab => tab.id).includes(knownTab),
        );
        removedTabs.forEach(removedTabId => this.onTargetTabRemoved(removedTabId));

        const newTabs = tabs.filter(tab => {
            if (!knownTabIds.includes(tab.id)) {
                return true;
            }

            // Treat it as new if the url has changed
            const tabUrl = this.knownTabs[tab.id];
            return tabUrl !== tab.url;
        });
        for (const tab of newTabs) {
            await this.handleTabUrlUpdate(tab.id);
        }

        this.browserAdapter.addListenerOnConnect(port => {
            // do not remove this. We need this to detect if the extension is reloaded from the content scripts
        });

        this.browserAdapter.addListenerToWebNavigationUpdated(this.onTabNavigated);
        this.browserAdapter.addListenerToTabsOnRemoved(this.onTargetTabRemoved);
        this.browserAdapter.addListenerOnWindowsFocusChanged(this.onWindowFocusChanged);
        this.browserAdapter.addListenerToTabsOnActivated(this.onTabActivated);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onTabUpdated);

        this.detailsViewController.setupDetailsViewTabRemovedHandler(this.onDetailsViewTabRemoved);
    }

    private getUrl = async (tabId: number): Promise<string> => {
        const tabs = await this.browserAdapter.tabsQuery({});
        const tab = tabs.filter(t => t.id === tabId);
        if (tab && tab.length === 1) {
            return tab[0].url ?? '';
        } else {
            return '';
        }
    };

    private addKnownTabId = async (tabId: number) => {
        const url = await this.getUrl(tabId);
        if (this.knownTabs[tabId] === undefined || this.knownTabs[tabId] !== url) {
            this.knownTabs[tabId] = url;
            if (this.persistStoreData) {
                await this.idbInstance.setItem(IndexedDBDataKeys.knownTabIds, this.knownTabs);
            }
        }
    };

    private removeKnownTabId = async (tabId: number) => {
        if (Object.keys(this.knownTabs).includes(tabId.toString())) {
            delete this.knownTabs[tabId];
            if (this.persistStoreData) {
                await this.idbInstance.setItem(IndexedDBDataKeys.knownTabIds, this.knownTabs);
            }
        }
    };

    private onTabNavigated = async (
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ): Promise<void> => {
        if (details.frameId === 0) {
            await this.handleTabUrlUpdate(details.tabId);
        }
    };

    private onTabUpdated = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
    ): Promise<void> => {
        if (changeInfo.url) {
            await this.handleTabUrlUpdate(tabId);
        }
    };

    private onTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo): Promise<void> => {
        const activeTabId = activeInfo.tabId;
        const windowId = activeInfo.windowId;

        this.sendTabVisibilityChangeAction(activeTabId, false);

        const tabs = await this.browserAdapter.tabsQuery({ windowId });
        tabs.forEach(tab => {
            if (!tab.active) {
                this.sendTabVisibilityChangeAction(tab.id, true);
            }
        });
    };

    private onWindowFocusChanged = async (windowId: number): Promise<void> => {
        const chromeWindows = await this.browserAdapter.getAllWindows({
            populate: false,
            windowTypes: ['normal', 'popup'],
        });

        chromeWindows.forEach(async chromeWindow => {
            const activeTabs = await this.browserAdapter.tabsQuery({
                active: true,
                windowId: chromeWindow.id,
            });

            for (const activeTab of activeTabs) {
                this.sendTabVisibilityChangeAction(
                    activeTab.id,
                    chromeWindow.state === 'minimized',
                );
            }
        });
    };

    private handleTabUrlUpdate = async (tabId: number): Promise<void> => {
        this.tabContextManager.addTabContextIfNotExists(tabId);
        this.sendTabUrlUpdatedAction(tabId);
        await this.addKnownTabId(tabId);
    };

    private sendTabUrlUpdatedAction(tabId: number): void {
        this.browserAdapter.getTab(
            tabId,
            (tab: chrome.tabs.Tab) => {
                this.tabContextManager.interpretMessageForTab(tabId, {
                    messageType: Messages.Tab.ExistingTabUpdated,
                    payload: tab,
                    tabId: tabId,
                });
            },
            () => {
                this.logger.log(
                    `sendTabUrlUpdatedAction: tab with ID ${tabId} not found, skipping action message`,
                );
            },
        );
    }

    private sendTabVisibilityChangeAction(tabId: number, isHidden: boolean): void {
        const payload: PageVisibilityChangeTabPayload = {
            hidden: isHidden,
        };
        const message: Message = {
            messageType: Messages.Tab.VisibilityChange,
            payload: payload,
            tabId: tabId,
        };
        this.tabContextManager.interpretMessageForTab(tabId, message);
    }

    private onTabRemoved = (tabId: number, messageType: string): void => {
        this.tabContextManager.interpretMessageForTab(tabId, {
            messageType: messageType,
            payload: null,
            tabId: tabId,
        });
    };

    private onTargetTabRemoved = (tabId: number): void => {
        this.onTabRemoved(tabId, Messages.Tab.Remove);
        this.removeKnownTabId(tabId);
        this.tabContextManager.deleteTabContext(tabId);
    };

    private onDetailsViewTabRemoved = (tabId: number): void => {
        this.onTabRemoved(tabId, Messages.Visualizations.DetailsView.Close);
    };
}
