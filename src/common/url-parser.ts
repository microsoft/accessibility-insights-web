// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class UrlParser {
    public getIntParam(urlString: string, key: string): number {
        const url = new URL(urlString);
        return parseInt(url.searchParams.get(key), 10);
    }

    public areURLHostNamesEqual(urlA: string, urlB: string): boolean {
        const urlAObj = new URL(urlA);
        const urlBObj = new URL(urlB);

        if (this.areBothFileUrls(urlAObj, urlBObj)) {
            return this.areFileUrlsEqual(urlA, urlB);
        }

        return this.areUrlProtocolsEqual(urlAObj, urlBObj) && urlAObj.hostname === urlBObj.hostname;
    }

    public areFileUrlsEqual(urlA: string, urlB: string): boolean {
        const urlAObj = new URL(urlA);
        const urlBObj = new URL(urlB);

        return urlAObj.href === urlBObj.href;
    }

    private areBothFileUrls(urlAObj: URL, urlBObj: URL): boolean {
        return this.areUrlProtocolsEqual(urlAObj, urlBObj) && urlAObj.protocol === 'file:' && urlBObj.protocol === 'file:';
    }

    private areUrlProtocolsEqual(urlAObj: URL, urlBObj: URL): boolean {
        return urlAObj.protocol === urlBObj.protocol;
    }
}
