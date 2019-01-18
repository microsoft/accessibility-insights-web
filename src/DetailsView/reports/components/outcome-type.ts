// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { countBy, values } from 'lodash';

import { IManualTestStatus, ManualTestStatus } from '../../../common/types/manual-test-status';

export type OutcomeType = 'pass' | 'incomplete' | 'fail';

export const allOutcomeTypes: OutcomeType[] = ['pass', 'incomplete', 'fail'];

export function outcomeTypeFromTestStatus(testStatus: ManualTestStatus) {
    const statusMap = {
        [ManualTestStatus.PASS]: 'pass',
        [ManualTestStatus.FAIL]: 'fail',
        [ManualTestStatus.UNKNOWN]: 'incomplete',
    } as { [P in ManualTestStatus]: OutcomeType };

    return statusMap[testStatus];
}

export function outcomeTypeSemanticsFromTestStatus(testStatus: ManualTestStatus): OutcomeTypeSemantic {
    return outcomeTypeSemantics[outcomeTypeFromTestStatus(testStatus)];
}

export interface OutcomeTypeSemantic {
    pastTense: string;
}

export const outcomeTypeSemantics: { [OT in OutcomeType]: OutcomeTypeSemantic } = {
    pass: { pastTense: 'passed' },
    incomplete: { pastTense: 'incomplete' },
    fail: { pastTense: 'failed' },
};

export type OutcomeStats = { [OT in OutcomeType]: number };

export function outcomeStatsFromManualTestStatus(testStepStatus: IManualTestStatus): OutcomeStats {
    const outcomeTypeSet = values(testStepStatus)
        .map(s => outcomeTypeFromTestStatus(s.stepFinalResult));
    const stats = countBy(outcomeTypeSet) as OutcomeStats;
    stats.pass = stats.pass || 0;
    stats.incomplete = stats.incomplete || 0;
    stats.fail = stats.fail || 0;
    return stats;
}
