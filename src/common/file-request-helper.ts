// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { XMLHttpRequestFactory } from '../background/xml-http-request-factory';

export class FileRequestHelper {
    private _q: typeof Q;
    private xmlHttpRequestFactory: XMLHttpRequestFactory;
    private static readonly timeoutInMilliSec = 10000;

    constructor(q: typeof Q, xmlHttpRequestFactory: XMLHttpRequestFactory) {
        this._q = q;
        this.xmlHttpRequestFactory = xmlHttpRequestFactory;
    }

    public getFileContent(url): Q.Promise<string> {
        const deferred = this._q.defer<string>();
        const xhttp = this.xmlHttpRequestFactory.createHttpRequest();

        xhttp.timeout = FileRequestHelper.timeoutInMilliSec;

        xhttp.onload = function () {
            deferred.resolve(xhttp.responseText);
        };

        xhttp.onerror = function (error) {
            console.log('responce code - ' + error + xhttp.status + '. Unable to fetch metadata for url - ' + url);
            deferred.reject(null);
        };

        xhttp.ontimeout = function() {
            console.log('request timed out for url - ' + url);
            deferred.reject(null);
        };

        xhttp.open('GET', url, true);
        xhttp.send();

        return deferred.promise;
    }
}
