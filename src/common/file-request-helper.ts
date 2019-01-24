// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { XMLHttpRequestFactory } from '../background/xml-http-request-factory';

export class FileRequestHelper {
    private xmlHttpRequestFactory: XMLHttpRequestFactory;
    private static readonly timeoutInMilliSec = 10000;

    constructor(xmlHttpRequestFactory: XMLHttpRequestFactory) {
        this.xmlHttpRequestFactory = xmlHttpRequestFactory;
    }

    public getFileContent(url): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhttp = this.xmlHttpRequestFactory.createHttpRequest();

            xhttp.timeout = FileRequestHelper.timeoutInMilliSec;

            xhttp.onload = function() {
                resolve(xhttp.responseText);
            };

            xhttp.onerror = function(error) {
                console.log('responce code - ' + error + xhttp.status + '. Unable to fetch metadata for url - ' + url);
                reject(null);
            };

            xhttp.ontimeout = function() {
                console.log('request timed out for url - ' + url);
                reject(null);
            };

            xhttp.open('GET', url, true);
            xhttp.send();
        });
    }
}
