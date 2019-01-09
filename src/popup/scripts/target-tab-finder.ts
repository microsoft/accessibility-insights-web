// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IChromeAdapter } from '../../background/browser-adapter';
import { ITab } from '../../common/itab';
import { UrlParser } from '../../common/url-parser';
import { UrlValidator } from '../../common/url-validator';

export interface TargetTabInfo {
    tab: ITab;
    hasAccess: boolean;
}

export class TargetTabFinder {
    constructor(
        private readonly win: Window,
        private readonly browserAdapter: IChromeAdapter,
        private readonly urlValidator: UrlValidator,
        private readonly urlParser: UrlParser,
    ) {
    }

    public getTargetTab(): PromiseLike<TargetTabInfo> {
        return this.getTabInfo()
            .then(this.createTargetTabInfo);
    }

    @autobind
    private getTabInfo(): PromiseLike<ITab> {
        return new Promise((resolve, reject) => {
            const tabIdInUrl = this.urlParser.getIntParam(this.win.location.href, 'tabId');

            if (isNaN(tabIdInUrl)) {
                this.browserAdapter.tabsQuery({
                    active: true,
                    currentWindow: true,
                }, (tabs: ITab[]): void => {
                    resolve(tabs.pop());
                });
            }
            else {
                this.browserAdapter.getTab(tabIdInUrl, (tab: ITab) => {
                    resolve(tab);
                });
            }
        });
    }

    @autobind
    private createTargetTabInfo(tab: ITab): PromiseLike<TargetTabInfo> {
        return this.urlValidator.isSupportedUrl(tab.url, this.browserAdapter)
            .then(hasAccess => {
                const targetTab: TargetTabInfo = {
                    tab: tab,
                    hasAccess,
                };
                return targetTab;
            });
    }

}
