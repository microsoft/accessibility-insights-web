// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import {
    InstanceResultStatus,
    UnifiedResolution,
} from 'common/types/store-data/unified-data-interface';

import { RuleResultsData } from './android-scan-results';

export type GetUnifiedResolutionDelegate = (ruleResultsData: RuleResultsData) => UnifiedResolution;
export type GetResultStatusDelegate = (ruleResultsData: RuleResultsData) => InstanceResultStatus;

export class RuleInformation {
    constructor(
        readonly ruleId: string,
        readonly ruleLink: string,
        readonly ruleDescription: string,
        readonly guidance: GuidanceLink[],
        readonly getUnifiedResolutionDelegate: GetUnifiedResolutionDelegate,
        readonly getResultStatusDelegate: GetResultStatusDelegate,
    ) {}

    public getUnifiedResolution(ruleResultsData: RuleResultsData): UnifiedResolution {
        return this.getUnifiedResolutionDelegate(ruleResultsData);
    }

    public getResultStatus(ruleResultsData: RuleResultsData): InstanceResultStatus {
        return this.getResultStatusDelegate(ruleResultsData);
    }
}
