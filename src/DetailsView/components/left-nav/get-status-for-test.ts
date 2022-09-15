// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { ManualTestStatus } from '../../../common/types/store-data/manual-test-status';

export const getStatusForTest = (stats: RequirementOutcomeStats): ManualTestStatus => {
    if (stats.incomplete > 0) {
        return ManualTestStatus.UNKNOWN;
    } else if (stats.fail > 0) {
        return ManualTestStatus.FAIL;
    } else {
        return ManualTestStatus.PASS;
    }
};
