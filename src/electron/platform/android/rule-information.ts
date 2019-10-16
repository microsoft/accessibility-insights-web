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
        readonly getUnifiedFormattableResolutionDelegate: GetUnifiedResolutionDelegate,
        readonly includeThisResultDelegate: IncludeThisResultDelegate,
    ) {}

    public getUnifiedFormattableResolution(ruleResultsData: RuleResultsData): UnifiedResolution {
        return this.getUnifiedFormattableResolutionDelegate(ruleResultsData);
    }

    public includeThisResult(ruleResultsData: RuleResultsData): boolean {
        return this.includeThisResultDelegate(ruleResultsData);
    }
}
