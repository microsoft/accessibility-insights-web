// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { PlaceholderAxeResult } from 'electron/platform/electron/placeholder-axe-result';

export type ScanResultsFetcher = (port: number) => Promise<AxeAnalyzerResult>;

export const createScanResultsFetcher = (getCurrentDate: () => Date): ScanResultsFetcher => {
    return async (port: number) => {
        return new PlaceholderAxeResult(getCurrentDate().getTime().toString());
    };
};
