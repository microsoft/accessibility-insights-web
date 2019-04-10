// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Message } from '../common/message';
import { Messages } from '../common/messages';
import { Logger } from './../common/logging/logger';
import { PageVisibilityChangeTabPayload } from './actions/action-payloads';
import { BrowserAdapter } from './browser-adapter';
import { DetailsViewController } from './details-view-controller';
import { TabToContextMap } from './tab-context';
import { TabContextBroadcaster } from './tab-context-broadcaster';
import { TabContextFactory } from './tab-context-factory';

export class TabController {
    private chromeAdapter: BrowserAdapter;
    private readonly tabIdToContextMap: TabToContextMap;
    private readonly broadcaster: TabContextBroadcaster;
    private readonly detailsViewController: DetailsViewController;
    private tabContextFactory: TabContextFactory;

    constructor(
        tabToInterpreterMap: TabToContextMap,
        broadcaster: TabContextBroadcaster,
        chromeAdapter: BrowserAdapter,
        detailsViewController: DetailsViewController,
        tabContextFactory: TabContextFactory,
        private readonly logger: Logger,
    ) {
        this.tabIdToContextMap = tabToInterpreterMap;
        this.broadcaster = broadcaster;
        this.chromeAdapter = chromeAdapter;
        this.detailsViewController = detailsViewController;
        this.tabContextFactory = tabContextFactory;
    }

    public initialize(): void {
        this.chromeAdapter.tabsQuery({}, (tabs: chrome.tabs.Tab[]) => {
            if (tabs) {
                tabs.forEach(tab => {
                    this.handleTabUpdate(tab.id);
                });
            }
        });

        this.chromeAdapter.addListenerOnConnect(port => {
            // do not remove this. We need this to detect if the extension is reloaded from the content scripts
        });

        this.chromeAdapter.addListenerToWebNavigationUpdated(this.onTabNavigated);
        this.chromeAdapter.addListenerToTabsOnRemoved(this.onTargetTabRemoved);
        this.chromeAdapter.addListenerOnWindowsFocusChanged(this.onWindowFocusChanged);
        this.chromeAdapter.addListenerToTabsOnActivated(this.onTabActivated);
        this.chromeAdapter.addListenerToTabsOnUpdated(this.handleTabUpdate);

        this.detailsViewController.setupDetailsViewTabRemovedHandler(this.onDetailsViewTabRemoved);
    }

    @autobind
    private onTabNavigated(details: chrome.webNavigation.WebNavigationFramedCallbackDetails): void {
        if (details.frameId === 0) {
            this.handleTabUpdate(details.tabId);
        }
    }

    @autobind
    private onTabActivated(activeInfo: chrome.tabs.TabActiveInfo): void {
        const activeTabId = activeInfo.tabId;
        const windowId = activeInfo.windowId;

        this.sendTabVisibilityChangeAction(activeTabId, false);

        this.chromeAdapter.tabsQuery({ windowId: windowId }, (tabs: chrome.tabs.Tab[]) => {
            tabs.forEach((tab: chrome.tabs.Tab) => {
                if (!tab.active) {
                    this.sendTabVisibilityChangeAction(tab.id, true);
                }
            });
        });
    }

    @autobind
    private onWindowFocusChanged(windowId: number): void {
        this.chromeAdapter.getAllWindows(
            { populate: false, windowTypes: ['normal', 'popup'] },
            (chromeWindows: chrome.windows.Window[]) => {
                chromeWindows.forEach((chromeWindow: chrome.windows.Window) => {
                    this.chromeAdapter.getSelectedTabInWindow(chromeWindow.id, (activeTab: chrome.tabs.Tab) => {
                        if (!this.chromeAdapter.getRuntimeLastError()) {
                            if (activeTab) {
                                this.sendTabVisibilityChangeAction(activeTab.id, chromeWindow.state === 'minimized');
                            }
                        }
                    });
                });
            },
        );
    }

    @autobind
    private handleTabUpdate(tabId: number): void {
        if (this.hasTabContext(tabId)) {
            this.sendTabChangedAction(tabId);
        } else {
            this.addTabContext(tabId);
            this.sendTabUpdateAction(tabId);
        }
    }

    private hasTabContext(tabId: number): boolean {
        return tabId in this.tabIdToContextMap;
    }

    private sendTabChangedAction(tabId: number): void {
        this.chromeAdapter.getTab(
            tabId,
            (tab: chrome.tabs.Tab) => {
                const tabContext = this.tabIdToContextMap[tabId];
                if (tabContext) {
                    const interpreter = tabContext.interpreter;
                    interpreter.interpret({
                        type: Messages.Tab.Change,
                        payload: tab,
                        tabId: tabId,
                    });
                }
            },
            () => {
                this.logger.log(`changed tab with Id ${tabId} not found`);
            },
        );
    }

    private sendTabUpdateAction(tabId: number): void {
        this.chromeAdapter.getTab(
            tabId,
            (tab: chrome.tabs.Tab) => {
                const tabContext = this.tabIdToContextMap[tabId];
                if (tabContext) {
                    const interpreter = tabContext.interpreter;
                    interpreter.interpret({
                        type: Messages.Tab.Update,
                        payload: tab,
                        tabId: tabId,
                    });
                }
            },
            () => {
                this.logger.log(`updated tab with Id ${tabId} not found`);
            },
        );
    }

    private sendTabVisibilityChangeAction(tabId: number, isHidden: boolean): void {
        if (!this.hasTabContext(tabId)) {
            return;
        }
        const tabContext = this.tabIdToContextMap[tabId];
        if (tabContext == null) {
            return;
        }
        const interpreter = tabContext.interpreter;
        const payload: PageVisibilityChangeTabPayload = {
            hidden: isHidden,
        };
        const message: Message = {
            type: Messages.Tab.VisibilityChange,
            payload: payload,
            tabId: tabId,
        };
        interpreter.interpret(message);
    }

    private addTabContext(tabId: number): void {
        this.tabIdToContextMap[tabId] = this.tabContextFactory.createTabContext(
            this.broadcaster.getBroadcastMessageDelegate(tabId),
            this.chromeAdapter,
            this.detailsViewController,
            tabId,
        );
    }

    @autobind
    private onTabRemoved(tabId: number, messageType: string): void {
        const tabContext = this.tabIdToContextMap[tabId];
        if (tabContext) {
            const interpreter = tabContext.interpreter;
            interpreter.interpret({
                type: messageType,
                payload: null,
                tabId: tabId,
            });
        }
    }

    @autobind
    private onTargetTabRemoved(tabId: number): void {
        this.onTabRemoved(tabId, Messages.Tab.Remove);
        delete this.tabIdToContextMap[tabId];
    }

    @autobind
    private onDetailsViewTabRemoved(tabId: number): void {
        this.onTabRemoved(tabId, Messages.Visualizations.DetailsView.Close);
    }
}
