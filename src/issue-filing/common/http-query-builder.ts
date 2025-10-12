// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { size, values } from 'lodash';
import { DictionaryStringTo } from '../../types/common-types';

export type QueryParam = {
    name: string;
    value: string;
};

export class HTTPQueryBuilder {
    // de facto max length for urls
    public static readonly maxUrlLength = 2000;
    private baseUrl: string;
    private parameters: DictionaryStringTo<QueryParam>;

    public withBaseUrl(baseUrl: string): HTTPQueryBuilder {
        this.baseUrl = baseUrl;
        return this;
    }

    public withParam(name: string, value: string): HTTPQueryBuilder {
        if (this.parameters == null) {
            this.parameters = {};
        }

        this.parameters[name] = {
            name,
            value,
        };

        return this;
    }

    public build(): string {
        if (size(this.parameters) === 0) {
            return this.baseUrl;
        }

        const queryParameters = values(this.parameters)
            .map(param => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`)
            .join('&');

        const fullUrl = `${this.baseUrl}?${queryParameters}`;

        // The following warning is thrown incorrectly because the call to 'truncate' is not on the file system
        // see bug: https://github.com/nodesecurity/eslint-plugin-security/issues/54
        return this.truncate(fullUrl);
    }

    private truncate(url: string): string {
        if (url.length <= HTTPQueryBuilder.maxUrlLength) {
            return url;
        }

        const truncated = url.substr(0, HTTPQueryBuilder.maxUrlLength);

        const lastIndexOpeningTag = truncated.lastIndexOf('%3C');

        if (lastIndexOpeningTag >= 0) {
            return truncated.substr(0, lastIndexOpeningTag);
        }

        return truncated;
    }
}
