// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResolution } from 'common/types/store-data/unified-data-interface';
import { RuleResultsData } from './scan-results';

export type GetUnifiedResolutionDelegate = (ruleResultsData: RuleResultsData) => UnifiedResolution;

export class RuleInformation {
    constructor(
        readonly ruleId: string,
        readonly ruleDescription: string,
        readonly getUnifiedResolutionDelegate: GetUnifiedResolutionDelegate,
    ) {}

    public getUnifiedResolution(ruleResultsData: RuleResultsData): UnifiedResolution {
        return this.getUnifiedResolutionDelegate(ruleResultsData);
    }
}
