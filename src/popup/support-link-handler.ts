// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../background/browser-adapters/browser-adapter';
import { config } from '../common/configuration';
import { WindowUtils } from '../common/window-utils';

export class SupportLinkHandler {
    private _browserAdapter: BrowserAdapter;
    private _windowUtils: WindowUtils;

    constructor(browserAdapter: BrowserAdapter, windowUtils: WindowUtils) {
        this._browserAdapter = browserAdapter;
        this._windowUtils = windowUtils;
    }

    public sendEmail(title: string): void {
        const emailHelpAlias = config.getOption('emailHelpAlias');
        const mailToLink = encodeURI(`mailto:${emailHelpAlias}?subject=Question about ${title}`);

        this._browserAdapter.createInactiveTab(mailToLink, tab => {
            this._windowUtils.setTimeout(() => {
                this._browserAdapter.closeTab(tab.id);
            }, 500);
        });
    }
}
