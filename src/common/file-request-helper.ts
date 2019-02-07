// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { XMLHttpRequestFactory } from '../background/xml-http-request-factory';
import { createConsoleLogger } from './logging/console-logger';
import { Logger } from './logging/logger';

export class FileRequestHelper {
    private static readonly timeoutInMilliSec = 10000;

    constructor(private xmlHttpRequestFactory: XMLHttpRequestFactory, private logger: Logger = createConsoleLogger()) {}

    public getFileContent(url): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhttp = this.xmlHttpRequestFactory.createHttpRequest();

            xhttp.timeout = FileRequestHelper.timeoutInMilliSec;

            xhttp.onload = () => {
                resolve(xhttp.responseText);
            };

            xhttp.onerror = error => {
                this.logger.log('responce code - ' + error + xhttp.status + '. Unable to fetch metadata for url - ' + url);
                reject(null);
            };

            xhttp.ontimeout = () => {
                this.logger.log('request timed out for url - ' + url);
                reject(null);
            };

            xhttp.open('GET', url, true);
            xhttp.send();
        });
    }
}
