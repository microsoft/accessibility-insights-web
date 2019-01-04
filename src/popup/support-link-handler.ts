// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChromeAdapter } from '../background/browser-adapter';
import { WindowUtils } from '../common/window-utils';
import { config } from '../common/configuration';

export class SupportLinkHandler {
    private _chromeAdapter: IChromeAdapter;
    private _windowUtils: WindowUtils;

    constructor(chromeAdapter: IChromeAdapter, windowUtils: WindowUtils) {
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
