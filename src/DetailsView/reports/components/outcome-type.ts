// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { countBy, values } from 'lodash';

import { ManualTestStatus, ManualTestStatusData } from '../../../common/types/manual-test-status';

export type RequirementOutcomeType = 'pass' | 'incomplete' | 'fail';

export const allOutcomeTypes: RequirementOutcomeType[] = ['pass', 'incomplete', 'fail'];

export function outcomeTypeFromTestStatus(testStatus: ManualTestStatus): RequirementOutcomeType {
    const statusMap = {
        [ManualTestStatus.PASS]: 'pass',
        [ManualTestStatus.FAIL]: 'fail',
        [ManualTestStatus.UNKNOWN]: 'incomplete',
    } as { [P in ManualTestStatus]: RequirementOutcomeType };

    return statusMap[testStatus];
}

export function outcomeTypeSemanticsFromTestStatus(testStatus: ManualTestStatus): OutcomeTypeSemantic {
    return outcomeTypeSemantics[outcomeTypeFromTestStatus(testStatus)];
}

export interface OutcomeTypeSemantic {
    pastTense: string;
}

export const outcomeTypeSemantics: { [OT in RequirementOutcomeType]: OutcomeTypeSemantic } = {
    pass: { pastTense: 'passed' },
    incomplete: { pastTense: 'incomplete' },
    fail: { pastTense: 'failed' },
};

export type OutcomeStats = { [OT in RequirementOutcomeType]: number };

export function outcomeStatsFromManualTestStatus(testStepStatus: ManualTestStatusData): OutcomeStats {
    const outcomeTypeSet = values(testStepStatus).map(s => outcomeTypeFromTestStatus(s.stepFinalResult));
    const stats = countBy(outcomeTypeSet) as OutcomeStats;
    stats.pass = stats.pass || 0;
    stats.incomplete = stats.incomplete || 0;
    stats.fail = stats.fail || 0;
    return stats;
}
