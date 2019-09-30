// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { DictionaryStringTo } from '../types/common-types';

export class DetailsViewController {
    private tabIdToDetailsViewMap: DictionaryStringTo<number> = {};
    private browserAdapter: BrowserAdapter;
    private detailsViewRemovedHandler: (tabId: number) => void;

    constructor(adapter: BrowserAdapter) {
        this.browserAdapter = adapter;
        this.browserAdapter.addListenerToTabsOnRemoved(this.onRemoveTab);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onUpdateTab);
    }

    public setupDetailsViewTabRemovedHandler(handler: (tabId: number) => void): void {
        this.detailsViewRemovedHandler = handler;
    }

    public showDetailsView(targetTabId: number): void {
        const detailsViewTabId = this.tabIdToDetailsViewMap[targetTabId];

        if (detailsViewTabId != null) {
            this.browserAdapter.switchToTab(detailsViewTabId);
            return;
        }

        this.browserAdapter.createTabInNewWindow(this.getDetailsUrl(targetTabId), (tab: chrome.tabs.Tab) => {
            this.tabIdToDetailsViewMap[targetTabId] = tab.id;
        });
    }

    private onUpdateTab = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void => {
        const targetTabId = this.getTargetTabIdForDetailsTabId(tabId);

        if (targetTabId == null) {
            return;
        }

        if (this.hasUrlChange(changeInfo, targetTabId)) {
            delete this.tabIdToDetailsViewMap[targetTabId];
            if (this.detailsViewRemovedHandler != null) {
                this.detailsViewRemovedHandler(targetTabId);
            }
        }
    };

    private hasUrlChange(changeInfo: chrome.tabs.TabChangeInfo, targetTabId): boolean {
        return (
            changeInfo.url &&
            !this.stringEndsWith(changeInfo.url.toLocaleLowerCase(), this.getDetailsUrlWithExtensionId(targetTabId).toLocaleLowerCase())
        );
    }

    private stringEndsWith(str: string, suffix: string): boolean {
        return str.substring(str.length - suffix.length) === suffix;
    }

    private getDetailsUrl(tabId: number): string {
        return `DetailsView/detailsView.html?tabId=${tabId}`;
    }

    private getDetailsUrlWithExtensionId(tabId: number): string {
        return `${this.browserAdapter.getRunTimeId()}/${this.getDetailsUrl(tabId)}`;
    }

    private getTargetTabIdForDetailsTabId(detailsTabId: number): number {
        if (detailsTabId != null) {
            for (const tabId in this.tabIdToDetailsViewMap) {
                if (this.tabIdToDetailsViewMap[tabId] === detailsTabId) {
                    return parseInt(tabId, 10);
                }
            }
        }
        return null;
    }

    private onRemoveTab = (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo): void => {
        if (this.tabIdToDetailsViewMap[tabId]) {
            delete this.tabIdToDetailsViewMap[tabId];
        } else {
            const targetTabId = this.getTargetTabIdForDetailsTabId(tabId);
            if (targetTabId) {
                delete this.tabIdToDetailsViewMap[targetTabId];
                if (this.detailsViewRemovedHandler != null) {
                    this.detailsViewRemovedHandler(targetTabId);
                }
            }
        }
    };
}
