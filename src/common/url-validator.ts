// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../background/browser-adapter';

export class UrlValidator {
    public async isSupportedUrl(url: string, chromeAdapter: BrowserAdapter): Promise<boolean> {
        const lowerCasedUrl: string = url.toLowerCase();
        if (lowerCasedUrl.match('http://*/*')
            || lowerCasedUrl.match('https://*/*')
        ) {
            return lowerCasedUrl.indexOf('https://chrome.google.com') !== 0;
        }

        else if (UrlValidator.isFileUrl(lowerCasedUrl)) {
            return await this.checkAccessToFileUrl(chromeAdapter);
        }
        else {
            return false;
        }
    }

    public static isFileUrl(url: string): boolean {
        return url.toLowerCase().match('file://*/*') != null;
    }

    private checkAccessToFileUrl(chromeAdapter: BrowserAdapter): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            chromeAdapter.isAllowedFileSchemeAccess(resolve);
        });
    }
}
