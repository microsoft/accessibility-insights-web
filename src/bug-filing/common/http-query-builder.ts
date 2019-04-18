// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../types/common-types';
import { size, values } from 'lodash';

export type QueryParam = {
    name: string;
    value: string;
};

export class HTTPQueryBuilder {
    public static readonly maxUrlLength = 3000;
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

        let fullUrl = `${this.baseUrl}?${queryParameters}`;

        return this.truncate(fullUrl);
    }

    private truncate(url: string): string {
        if (url.length <= HTTPQueryBuilder.maxUrlLength) {
            return url;
        }

        const truncateIndex = url.substr(0, HTTPQueryBuilder.maxUrlLength).length;
        return url.substr(0, truncateIndex);
    }
}
