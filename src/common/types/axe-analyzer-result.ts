// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SingleElementSelector } from 'common/types/store-data/scoping-store-data';
import { ScanResults } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

export interface AxeAnalyzerResult {
    results: DictionaryStringTo<any>;
    originalResult?: ScanResults;
    include?: SingleElementSelector[];
    exclude?: SingleElementSelector[];
}
