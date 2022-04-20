// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewController } from 'background/details-view-controller';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { DictionaryStringTo } from 'types/common-types';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';

export class ExtensionDetailsViewController implements DetailsViewController {
    private detailsViewRemovedHandler: (tabId: number) => void;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly tabIdToDetailsViewMap: DictionaryStringTo<number>,
        private readonly idbInstance: IndexedDBAPI,
    ) {
        this.browserAdapter.addListenerToTabsOnRemoved(this.onRemoveTab);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onUpdateTab);
    }

    private persistTabIdToDetailsViewMap = async () => {
        await this.idbInstance.setItem(
            IndexedDBDataKeys.tabIdToDetailsViewMap,
            this.tabIdToDetailsViewMap,
        );
    };

    public setupDetailsViewTabRemovedHandler(handler: (tabId: number) => void): void {
        this.detailsViewRemovedHandler = handler;
    }

    public async showDetailsView(targetTabId: number): Promise<void> {
        const detailsViewTabId = this.tabIdToDetailsViewMap[targetTabId];

        if (detailsViewTabId != null) {
            await this.browserAdapter.switchToTab(detailsViewTabId);
            return;
        }

        const tab = await this.browserAdapter.createTabInNewWindow(
            this.getRelativeDetailsUrl(targetTabId),
        );

        if (tab?.id != null) {
            this.tabIdToDetailsViewMap[targetTabId] = tab.id;
            await this.persistTabIdToDetailsViewMap();
        }
    }

    private onUpdateTab = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab,
    ): Promise<void> => {
        const targetTabId = this.getTargetTabIdForDetailsTabId(tabId);

        if (targetTabId == null) {
            return;
        }

        if (this.hasUrlChange(changeInfo, targetTabId)) {
            delete this.tabIdToDetailsViewMap[targetTabId];
            if (this.detailsViewRemovedHandler != null) {
                this.detailsViewRemovedHandler(targetTabId);
            }
            await this.persistTabIdToDetailsViewMap();
        }
    };

    private hasUrlChange(changeInfo: chrome.tabs.TabChangeInfo, targetTabId): boolean {
        if (changeInfo.url == null) {
            return false;
        }

        const normalizedNewUrl = changeInfo.url.toLocaleLowerCase();
        const expectedDetailsUrl = this.getAbsoluteDetailsUrl(targetTabId);
        const normalizedExpectedDetailsUrl = expectedDetailsUrl.toLocaleLowerCase();

        return !normalizedNewUrl.startsWith(normalizedExpectedDetailsUrl);
    }

    private getRelativeDetailsUrl(tabId: number): string {
        return `/DetailsView/detailsView.html?tabId=${tabId}`;
    }

    private getAbsoluteDetailsUrl(tabId: number): string {
        return this.browserAdapter.getUrl(this.getRelativeDetailsUrl(tabId));
    }

    private getTargetTabIdForDetailsTabId(detailsTabId: number): number | null {
        if (detailsTabId != null) {
            for (const tabId in this.tabIdToDetailsViewMap) {
                if (this.tabIdToDetailsViewMap[tabId] === detailsTabId) {
                    return parseInt(tabId, 10);
                }
            }
        }
        return null;
    }

    private onRemoveTab = async (
        tabId: number,
        removeInfo: chrome.tabs.TabRemoveInfo,
    ): Promise<void> => {
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

        await this.persistTabIdToDetailsViewMap();
    };
}
