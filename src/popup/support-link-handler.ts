// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { config } from '../common/configuration';
import { WindowUtils } from '../common/window-utils';

export class SupportLinkHandler {
    private browserAdapter: BrowserAdapter;
    private windowUtils: WindowUtils;

    constructor(browserAdapter: BrowserAdapter, windowUtils: WindowUtils) {
        this.browserAdapter = browserAdapter;
        this.windowUtils = windowUtils;
    }

    public sendEmail(title: string): void {
        const emailHelpAlias = config.getOption('emailHelpAlias');
        const mailToLink = encodeURI(
            `mailto:${emailHelpAlias}?subject=Question about ${title}`,
        );

        this.browserAdapter.createInactiveTab(mailToLink, tab => {
            this.windowUtils.setTimeout(() => {
                this.browserAdapter.closeTab(tab.id);
            }, 500);
        });
    }
}
