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
        const urlAObj = this.tryParseUrl(urlA);
        const urlBObj = this.tryParseUrl(urlB);

        if (urlAObj == null || urlBObj == null) {
            return urlA === urlB;
        }

        if (this.areBothFileUrls(urlAObj, urlBObj)) {
            return this.areFileUrlsEqual(urlAObj, urlBObj);
        }

        return this.areUrlProtocolsEqual(urlAObj, urlBObj) && urlAObj.hostname === urlBObj.hostname;
    }

    public areURLsSameOrigin(
        urlA: string | null | undefined,
        urlB: string | null | undefined,
    ): boolean {
        const urlAOrigin = this.tryParseOrigin(urlA);
        const urlBOrigin = this.tryParseOrigin(urlB);

        if (urlAOrigin == null || urlBOrigin == null) {
            return urlA === urlB;
        } else {
            return urlAOrigin === urlBOrigin;
        }
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

    private tryParseUrl(url: string | null | undefined): URL | null {
        if (url == null) {
            return null;
        }
        try {
            return new URL(url);
        } catch (e) {
            return null;
        }
    }

    private tryParseOrigin(url: string | null | undefined): string | null {
        const urlObj = this.tryParseUrl(url);

        // Yes, it really can be the string "null" for some browser/Node environments
        if (urlObj == null || urlObj.origin == null || urlObj.origin === 'null') {
            return null;
        }

        return urlObj.origin;
    }
}
