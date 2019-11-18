// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { Message } from 'common/message';
import { Messages } from 'common/messages';

import { PageVisibilityChangeTabPayload } from './actions/action-payloads';
import { DetailsViewController } from './details-view-controller';
import { TabToContextMap } from './tab-context';
import { TabContextBroadcaster } from './tab-context-broadcaster';
import { TabContextFactory } from './tab-context-factory';

export class TargetPageController {
    constructor(
        private readonly targetPageTabIdToContextMap: TabToContextMap,
        private readonly broadcaster: TabContextBroadcaster,
        private readonly browserAdapter: BrowserAdapter,
        private readonly detailsViewController: DetailsViewController,
        private readonly tabContextFactory: TabContextFactory,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.browserAdapter.tabsQuery({}, (tabs: chrome.tabs.Tab[]) => {
            if (tabs) {
                tabs.forEach(tab => {
                    this.postTabUpdate(tab.id);
                });
            }
        });

        this.browserAdapter.addListenerOnConnect(port => {
            // do not remove this. We need this to detect if the extension is reloaded from the content scripts
        });

        this.browserAdapter.addListenerToWebNavigationUpdated(this.onTabNavigated);
        this.browserAdapter.addListenerToTabsOnRemoved(this.onTargetTabRemoved);
        this.browserAdapter.addListenerOnWindowsFocusChanged(this.onWindowFocusChanged);
        this.browserAdapter.addListenerToTabsOnActivated(this.onTabActivated);
        this.browserAdapter.addListenerToTabsOnUpdated(this.handleTabUpdate);

        this.detailsViewController.setupDetailsViewTabRemovedHandler(this.onDetailsViewTabRemoved);
    }

    private onTabNavigated = (details: chrome.webNavigation.WebNavigationFramedCallbackDetails): void => {
        if (details.frameId === 0) {
            this.postTabUpdate(details.tabId);
        }
    };

    private onTabActivated = (activeInfo: chrome.tabs.TabActiveInfo): void => {
        const activeTabId = activeInfo.tabId;
        const windowId = activeInfo.windowId;

        this.sendTabVisibilityChangeAction(activeTabId, false);

        this.browserAdapter.tabsQuery({ windowId: windowId }, (tabs: chrome.tabs.Tab[]) => {
            tabs.forEach((tab: chrome.tabs.Tab) => {
                if (!tab.active) {
                    this.sendTabVisibilityChangeAction(tab.id, true);
                }
            });
        });
    };

    private onWindowFocusChanged = (windowId: number): void => {
        this.browserAdapter.getAllWindows(
            { populate: false, windowTypes: ['normal', 'popup'] },
            (chromeWindows: chrome.windows.Window[]) => {
                chromeWindows.forEach((chromeWindow: chrome.windows.Window) => {
                    this.browserAdapter.tabsQuery(
                        {
                            active: true,
                            windowId: chromeWindow.id,
                        },
                        (activeTabs: chrome.tabs.Tab[]) => {
                            if (!this.browserAdapter.getRuntimeLastError()) {
                                for (const activeTab of activeTabs) {
                                    this.sendTabVisibilityChangeAction(activeTab.id, chromeWindow.state === 'minimized');
                                }
                            }
                        },
                    );
                });
            },
        );
    };

    private postTabUpdate = (tabId: number): void => {
        if (this.hasTabContext(tabId)) {
            this.sendExistingTabUpdatedAction(tabId);
        } else {
            this.addTabContext(tabId);
            this.sendNewTabCreatedAction(tabId);
        }
    };

    private handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo): void => {
        if (changeInfo.url) {
            this.postTabUpdate(tabId);
        }
    };

    private hasTabContext(tabId: number): boolean {
        return tabId in this.targetPageTabIdToContextMap;
    }

    private sendTabAction(tabId: number, messageType: string): void {
        this.browserAdapter.getTab(
            tabId,
            (tab: chrome.tabs.Tab) => {
                const tabContext = this.targetPageTabIdToContextMap[tabId];
                if (tabContext) {
                    const interpreter = tabContext.interpreter;
                    interpreter.interpret({
                        messageType,
                        payload: tab,
                        tabId: tabId,
                    });
                }
            },
            () => {
                this.logger.log(`${messageType}: tab with Id ${tabId} not found`);
            },
        );
    }

    private sendExistingTabUpdatedAction(tabId: number): void {
        this.sendTabAction(tabId, Messages.Tab.ExistingTabUpdated);
    }

    private sendNewTabCreatedAction(tabId: number): void {
        this.sendTabAction(tabId, Messages.Tab.NewTabCreated);
    }

    private sendTabVisibilityChangeAction(tabId: number, isHidden: boolean): void {
        if (!this.hasTabContext(tabId)) {
            return;
        }
        const tabContext = this.targetPageTabIdToContextMap[tabId];
        if (tabContext == null) {
            return;
        }
        const interpreter = tabContext.interpreter;
        const payload: PageVisibilityChangeTabPayload = {
            hidden: isHidden,
        };
        const message: Message = {
            messageType: Messages.Tab.VisibilityChange,
            payload: payload,
            tabId: tabId,
        };
        interpreter.interpret(message);
    }

    private addTabContext(tabId: number): void {
        this.targetPageTabIdToContextMap[tabId] = this.tabContextFactory.createTabContext(
            this.broadcaster.getBroadcastMessageDelegate(tabId),
            this.browserAdapter,
            this.detailsViewController,
            tabId,
        );
    }

    private onTabRemoved = (tabId: number, messageType: string): void => {
        const tabContext = this.targetPageTabIdToContextMap[tabId];
        if (tabContext) {
            const interpreter = tabContext.interpreter;
            interpreter.interpret({
                messageType: messageType,
                payload: null,
                tabId: tabId,
            });
        }
    };

    private onTargetTabRemoved = (tabId: number): void => {
        this.onTabRemoved(tabId, Messages.Tab.Remove);
        delete this.targetPageTabIdToContextMap[tabId];
    };

    private onDetailsViewTabRemoved = (tabId: number): void => {
        this.onTabRemoved(tabId, Messages.Visualizations.DetailsView.Close);
    };
}
