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
        return urlAObj.hostname === urlBObj.hostname;
    }
}
