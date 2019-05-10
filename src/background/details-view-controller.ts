// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { DictionaryStringTo } from '../types/common-types';
import { BrowserAdapter } from './browser-adapters/browser-adapter';
import { RuntimeAdapter } from './browser-adapters/runtime-adapter';

export class DetailsViewController {
    private _tabIdToDetailsViewMap: DictionaryStringTo<number> = {};
    private _detailsViewRemovedHandler: (tabId: number) => void;

    constructor(private readonly browserAdapter: BrowserAdapter, private readonly runtimeAdapter: RuntimeAdapter) {
        this.browserAdapter.addListenerToTabsOnRemoved(this.onRemoveTab);
        this.browserAdapter.addListenerToTabsOnUpdated(this.onUpdateTab);
    }

    public setupDetailsViewTabRemovedHandler(handler: (tabId: number) => void): void {
        this._detailsViewRemovedHandler = handler;
    }

    public showDetailsView(targetTabId: number): void {
        const detailsViewTabId = this._tabIdToDetailsViewMap[targetTabId];

        if (detailsViewTabId != null) {
            this.browserAdapter.switchToTab(detailsViewTabId);
            return;
        }

        this.browserAdapter.createTabInNewWindow(this.getDetailsUrl(targetTabId), (tab: chrome.tabs.Tab) => {
            this._tabIdToDetailsViewMap[targetTabId] = tab.id;
        });
    }

    @autobind
    private onUpdateTab(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
        const targetTabId = this.getTargetTabIdForDetailsTabId(tabId);

        if (targetTabId == null) {
            return;
        }

        if (this.hasUrlChange(changeInfo, targetTabId)) {
            delete this._tabIdToDetailsViewMap[targetTabId];
            if (this._detailsViewRemovedHandler != null) {
                this._detailsViewRemovedHandler(targetTabId);
            }
        }
    }

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
        return `${this.runtimeAdapter.getRunTimeId()}/${this.getDetailsUrl(tabId)}`;
    }

    private getTargetTabIdForDetailsTabId(detailsTabId: number): number {
        if (detailsTabId != null) {
            for (const tabId in this._tabIdToDetailsViewMap) {
                if (this._tabIdToDetailsViewMap[tabId] === detailsTabId) {
                    return parseInt(tabId, 10);
                }
            }
        }
        return null;
    }

    @autobind
    private onRemoveTab(tabId: number, removeInfo: chrome.tabs.TabRemoveInfo): void {
        if (this._tabIdToDetailsViewMap[tabId]) {
            delete this._tabIdToDetailsViewMap[tabId];
        } else {
            const targetTabId = this.getTargetTabIdForDetailsTabId(tabId);
            if (targetTabId) {
                delete this._tabIdToDetailsViewMap[targetTabId];
                if (this._detailsViewRemovedHandler != null) {
                    this._detailsViewRemovedHandler(targetTabId);
                }
            }
        }
    }
}
