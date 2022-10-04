// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { TabContextFactory } from 'background/tab-context-factory';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { InterpreterMessage, Message } from 'common/message';
import { Messages } from 'common/messages';
import { DictionaryNumberTo } from 'types/common-types';
import { PageVisibilityChangeTabPayload } from './actions/action-payloads';
import { TabContextManager } from './tab-context-manager';

export class TargetPageController {
    constructor(
        private readonly tabContextManager: TabContextManager,
        private readonly tabContextFactory: TabContextFactory,
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger,
        private readonly knownTabs: DictionaryNumberTo<string>,
        private readonly idbInstance: IndexedDBAPI,
    ) {}

    public async initialize(): Promise<void> {
        const knownTabIds: number[] = Object.keys(this.knownTabs).map(knownTab =>
            parseInt(knownTab),
        );

        knownTabIds.forEach(tabId =>
            this.tabContextManager.addTabContextIfNotExists(tabId, this.tabContextFactory),
        );

        const tabs = await this.browserAdapter.tabsQuery({});

        const removedTabs = knownTabIds.filter(
            knownTab => !tabs.map(tab => tab.id).includes(knownTab),
        );
        await Promise.all(removedTabs.map(removedTabId => this.onTargetTabRemoved(removedTabId)));

        const newTabs = tabs.filter(tab => {
            if (!knownTabIds.includes(tab.id)) {
                return true;
            }

            // Treat it as new if the url has changed
            const tabUrl = this.knownTabs[tab.id];
            return tabUrl !== tab.url;
        });
        await Promise.all(newTabs.map(tab => this.handleTabUrlUpdate(tab.id)));
    }

    public async onTabNavigated(
        details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
    ): Promise<void> {
        if (details.frameId === 0) {
            await this.handleTabUrlUpdate(details.tabId);
        }
    }

    public async onTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo): Promise<void> {
        if (changeInfo.url) {
            await this.handleTabUrlUpdate(tabId);
        }
    }

    public async onTabActivated(activeInfo: chrome.tabs.TabActiveInfo): Promise<void> {
        const activeTabId = activeInfo.tabId;
        const windowId = activeInfo.windowId;

        await this.sendTabVisibilityChangeAction(activeTabId, false);

        const tabs = await this.browserAdapter.tabsQuery({ windowId });
        await Promise.all(
            tabs.map(async tab => {
                if (!tab.active) {
                    return this.sendTabVisibilityChangeAction(tab.id, true);
                }
            }),
        );
    }

    public async onWindowFocusChanged(): Promise<void> {
        const chromeWindows = await this.browserAdapter.getAllWindows({
            populate: false,
            windowTypes: ['normal', 'popup'],
        });

        chromeWindows.forEach(async chromeWindow => {
            const activeTabs = await this.browserAdapter.tabsQuery({
                active: true,
                windowId: chromeWindow.id,
            });

            await Promise.all(
                activeTabs.map(activeTab =>
                    this.sendTabVisibilityChangeAction(
                        activeTab.id,
                        chromeWindow.state === 'minimized',
                    ),
                ),
            );
        });
    }

    public async onTargetTabRemoved(tabId: number): Promise<void> {
        await this.interpretMessageAsync({
            messageType: Messages.Tab.Remove,
            payload: null,
            tabId: tabId,
        });
        await this.removeKnownTabId(tabId);
        await this.tabContextManager.deleteTabContext(tabId);
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
            await this.idbInstance.setItem(IndexedDBDataKeys.knownTabIds, this.knownTabs);
        }
    };

    private removeKnownTabId = async (tabId: number) => {
        if (Object.keys(this.knownTabs).includes(tabId.toString())) {
            delete this.knownTabs[tabId];
            await this.idbInstance.setItem(IndexedDBDataKeys.knownTabIds, this.knownTabs);
        }
    };

    private handleTabUrlUpdate = async (tabId: number): Promise<void> => {
        this.tabContextManager.addTabContextIfNotExists(tabId, this.tabContextFactory);
        await this.sendTabUrlUpdatedAction(tabId);
        await this.addKnownTabId(tabId);
    };

    private async sendTabUrlUpdatedAction(tabId: number): Promise<void> {
        let tab: chrome.tabs.Tab;
        try {
            tab = await this.browserAdapter.getTabAsync(tabId);
        } catch (e) {
            this.logger.log(
                `sendTabUrlUpdatedAction: tab with ID ${tabId} not found, skipping action message`,
            );
            return;
        }

        await this.interpretMessageAsync({
            messageType: Messages.Tab.ExistingTabUpdated,
            payload: tab,
            tabId: tabId,
        });
    }

    private async sendTabVisibilityChangeAction(tabId: number, isHidden: boolean): Promise<void> {
        const payload: PageVisibilityChangeTabPayload = {
            hidden: isHidden,
        };
        const message: Message = {
            messageType: Messages.Tab.VisibilityChange,
            payload: payload,
            tabId: tabId,
        };
        await this.interpretMessageAsync(message);
    }

    private async interpretMessageAsync(message: InterpreterMessage): Promise<void> {
        const response = this.tabContextManager.interpretMessageForTab(message.tabId, message);
        await response.result;
    }
}
