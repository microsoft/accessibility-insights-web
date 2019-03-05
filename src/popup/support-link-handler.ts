// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../background/browser-adapter';
import { config } from '../common/configuration';
import { WindowUtils } from '../common/window-utils';

export class SupportLinkHandler {
    private _chromeAdapter: BrowserAdapter;
    private _windowUtils: WindowUtils;

    constructor(chromeAdapter: BrowserAdapter, windowUtils: WindowUtils) {
        this._chromeAdapter = chromeAdapter;
        this._windowUtils = windowUtils;
    }

    public sendEmail(title: string): void {
        const emailHelpAlias = config.getOption('emailHelpAlias');
        const mailToLink = encodeURI(`mailto:${emailHelpAlias}?subject=Question about ${title}`);

        this._chromeAdapter.createInactiveTab(mailToLink, tab => {
            this._windowUtils.setTimeout(() => {
                this._chromeAdapter.closeTab(tab.id);
            }, 500);
        });
    }
}
