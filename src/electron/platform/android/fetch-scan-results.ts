// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { AndroidScanResults } from './android-scan-results';

export type ScanResultsFetcher = (port: number) => Promise<AndroidScanResults>;

export type HttpGet = typeof axios.get;

export const createScanResultsFetcher = (httpGet: HttpGet): ScanResultsFetcher => {
    return async (port: number) => {
        // TODO : This should jsut use port!
        const portHack = port ?? 62442;
        const response = await httpGet(`http://localhost:${portHack}/AccessibilityInsights/result`);
        return new AndroidScanResults(response.data);
    };
};
