// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from './browser-adapters/browser-adapter';

export class UrlValidator {
    constructor(private readonly browserAdapter: BrowserAdapter) {}

    public async isSupportedUrl(url?: string): Promise<boolean> {
        if (url == null) {
            return false;
        }
        const lowerCasedUrl: string = url.toLowerCase();
        if (lowerCasedUrl.startsWith('http://') || lowerCasedUrl.startsWith('https://')) {
            return this.hasSupportedPrefix(lowerCasedUrl);
        } else if (UrlValidator.isFileUrl(lowerCasedUrl)) {
            return await this.checkAccessToFileUrl();
        } else {
            return false;
        }
    }

    private hasSupportedPrefix(lowerCasedUrl: string): boolean {
        const unsupportedPrefixes = [
            'https://chrome.google.com/',
            'https://microsoftedge.microsoft.com/',
        ];
        return unsupportedPrefixes.every(prefix => !lowerCasedUrl.startsWith(prefix));
    }

    public static isFileUrl(url: string): boolean {
        return url.toLowerCase().startsWith('file://');
    }

    private checkAccessToFileUrl(): Promise<boolean> {
        return this.browserAdapter.isAllowedFileSchemeAccess();
    }
}
