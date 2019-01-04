// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChromeAdapter } from '../background/browser-adapter';
import * as Q from 'q';

export class UrlValidator {
    public isSupportedUrl(url: string, chromeAdapter: IChromeAdapter): Q.IPromise<boolean> {
        const deferred = Q.defer<boolean>();

        const lowerCasedUrl: string = url.toLowerCase();
        if (lowerCasedUrl.match('http://*/*')
            || lowerCasedUrl.match('https://*/*')
        ) {
            deferred.resolve(lowerCasedUrl.indexOf('https://chrome.google.com') !== 0);
        }

        else if (UrlValidator.isFileUrl(lowerCasedUrl)) {
            return this.checkAccessToFileUrl(chromeAdapter);
        }
        else {
            deferred.resolve(false);
        }
        return deferred.promise;
    }

    public static isFileUrl(url: string): boolean {
        return url.toLowerCase().match('file://*/*') != null;
    }

    private checkAccessToFileUrl(chromeAdapter: IChromeAdapter): Q.IPromise<boolean> {
        const defer = Q.defer<boolean>();
        chromeAdapter.isAllowedFileSchemeAccess(allowed => {
            defer.resolve(allowed);
        });
        return defer.promise;
    }
}
