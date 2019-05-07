// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../background/browser-adapters/browser-adapter';

export class UrlValidator {
    public async isSupportedUrl(url: string, chromeAdapter: BrowserAdapter): Promise<boolean> {
        const lowerCasedUrl: string = url.toLowerCase();
        if (lowerCasedUrl.startsWith('http://') || lowerCasedUrl.startsWith('https://')) {
            return this.hasSupportedPrefix(lowerCasedUrl);
        } else if (UrlValidator.isFileUrl(lowerCasedUrl)) {
            return await this.checkAccessToFileUrl(chromeAdapter);
        } else {
            return false;
        }
    }

    private hasSupportedPrefix(lowerCasedUrl: string): boolean {
        const unsupportedPrefixes = ['https://chrome.google.com/', 'https://microsoftedge.microsoft.com/'];
        return unsupportedPrefixes.every(prefix => !lowerCasedUrl.startsWith(prefix));
    }

    public static isFileUrl(url: string): boolean {
        return url.toLowerCase().startsWith('file://');
    }

    private checkAccessToFileUrl(chromeAdapter: BrowserAdapter): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            chromeAdapter.isAllowedFileSchemeAccess(resolve);
        });
    }
}
