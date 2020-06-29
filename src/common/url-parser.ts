// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class UrlParser {
    public getIntParam(urlString: string, key: string): number | null {
        const url = new URL(urlString);
        const rawParamValue = url.searchParams.get(key);
        if (rawParamValue == null) {
            return null;
        }
        return parseInt(rawParamValue, 10);
    }

    public areURLsEqual(urlA: string, urlB: string): boolean {
        const urlAObj = new URL(urlA);
        const urlBObj = new URL(urlB);

        if (this.areBothFileUrls(urlAObj, urlBObj)) {
            return this.areFileUrlsEqual(urlAObj, urlBObj);
        }

        return this.areUrlProtocolsEqual(urlAObj, urlBObj) && urlAObj.hostname === urlBObj.hostname;
    }

    private areFileUrlsEqual(urlAObj: URL, urlBObj: URL): boolean {
        return urlAObj.href === urlBObj.href;
    }

    private areBothFileUrls(urlAObj: URL, urlBObj: URL): boolean {
        return this.areUrlProtocolsEqual(urlAObj, urlBObj) && urlAObj.protocol === 'file:';
    }

    private areUrlProtocolsEqual(urlAObj: URL, urlBObj: URL): boolean {
        return urlAObj.protocol === urlBObj.protocol;
    }
}
