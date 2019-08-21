// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { ScanResults } from './scan-results';

export type FetchScanResultsType = (port: number) => Promise<ScanResults>;

export function fetchScanResults(port: number): Promise<ScanResults> {
    return new Promise<any>((resolve, reject) => {
        axios
            .get(`http://localhost:${port}/axe/result`)
            .then(response => {
                resolve(new ScanResults(response.data));
            })
            .catch(error => {
                reject(error);
            });
    });
}
