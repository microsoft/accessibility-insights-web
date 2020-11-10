// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    UnifiedFormattableResolution,
} from 'common/types/store-data/unified-data-interface';
import { GuidanceLink } from 'scanner/rule-to-links-mappings';

import { RuleResultsData } from './android-scan-results';

export type GetUnifiedFormattableResolutionDelegate = (
    ruleResultsData: RuleResultsData,
) => UnifiedFormattableResolution;

export type GetResultStatusDelegate = (ruleResultsData: RuleResultsData) => InstanceResultStatus;

export class RuleInformation {
    constructor(
        readonly ruleId: string,
        readonly ruleLink: string,
        readonly ruleDescription: string,
        readonly guidance: GuidanceLink[],
        readonly getUnifiedFormattableResolutionDelegate: GetUnifiedFormattableResolutionDelegate,
        readonly getResultStatusDelegate: GetResultStatusDelegate,
    ) {}

    public getUnifiedFormattableResolution(
        ruleResultsData: RuleResultsData,
    ): UnifiedFormattableResolution {
        return this.getUnifiedFormattableResolutionDelegate(ruleResultsData);
    }

    public getResultStatus(ruleResultsData: RuleResultsData): InstanceResultStatus {
        return this.getResultStatusDelegate(ruleResultsData);
    }
}
