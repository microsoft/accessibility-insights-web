// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { ScanResults } from './scan-results';

export type ScanResultsFetcher = (port: number) => Promise<ScanResults>;

export type HttpGet = typeof axios.get;

export const createScanResultsFetcher = (httpGet: HttpGet): ScanResultsFetcher => {
    return async (port: number) => {
        const response = await httpGet(`http://localhost:${port}/AccessibilityInsights/result`);
        return new ScanResults(response.data);
    };
};
