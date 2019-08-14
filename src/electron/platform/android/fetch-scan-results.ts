// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { ScanResults } from './scan-results';

export function fetchScanResults(port: number): Promise<ScanResults> {
    return axios
        .get(`http://localhost:${port}/axe/result`)
        .then(response => {
            return new ScanResults(response.data);
        })
        .catch(error => {
            return error;
        });
}
