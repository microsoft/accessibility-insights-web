// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResolution } from 'common/types/store-data/unified-data-interface';
import { RuleResultsData } from './scan-results';

export type GetUnifiedResolutionDelegate = (ruleResultsData: RuleResultsData) => UnifiedResolution;

export type IncludeThisResultDelegate = (ruleResultsData: RuleResultsData) => boolean;

export class RuleInformation {
    constructor(
        readonly ruleId: string,
        readonly ruleDescription: string,
        readonly getUnifiedFormattedResolutionDelegate: GetUnifiedResolutionDelegate,
        readonly includeThisResultDelegate: IncludeThisResultDelegate,
    ) {}

    public getUnifiedFormattedResolution(ruleResultsData: RuleResultsData): UnifiedResolution {
        return this.getUnifiedFormattedResolutionDelegate(ruleResultsData);
    }

    public includeThisResult(ruleResultsData: RuleResultsData): boolean {
        return this.includeThisResultDelegate(ruleResultsData);
    }
}
