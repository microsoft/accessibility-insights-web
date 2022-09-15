// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus, ManualTestStatusData } from 'common/types/store-data/manual-test-status';
import { countBy, values } from 'lodash';

import { OutcomeTypeSemantic, outcomeTypeSemantics } from './outcome-type';

export type RequirementOutcomeType = 'pass' | 'incomplete' | 'fail';

export const allRequirementOutcomeTypes: RequirementOutcomeType[] = ['pass', 'incomplete', 'fail'];

export function outcomeTypeFromTestStatus(testStatus: ManualTestStatus): RequirementOutcomeType {
    const statusMap = {
        [ManualTestStatus.PASS]: 'pass',
        [ManualTestStatus.FAIL]: 'fail',
        [ManualTestStatus.UNKNOWN]: 'incomplete',
    } as { [P in ManualTestStatus]: RequirementOutcomeType };

    return statusMap[testStatus];
}

export function outcomeTypeSemanticsFromTestStatus(
    testStatus: ManualTestStatus,
): OutcomeTypeSemantic {
    return outcomeTypeSemantics[outcomeTypeFromTestStatus(testStatus)];
}

export type RequirementOutcomeStats = { [OT in RequirementOutcomeType]: number };

export function outcomeStatsFromManualTestStatus(
    testStepStatus: ManualTestStatusData,
): RequirementOutcomeStats {
    const outcomeTypeSet = values(testStepStatus).map(s =>
        outcomeTypeFromTestStatus(s.stepFinalResult),
    );
    const stats = countBy(outcomeTypeSet) as RequirementOutcomeStats;
    stats.pass = stats.pass || 0;
    stats.incomplete = stats.incomplete || 0;
    stats.fail = stats.fail || 0;
    return stats;
}
