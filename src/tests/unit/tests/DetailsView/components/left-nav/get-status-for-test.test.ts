// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { ManualTestStatus } from '../../../../../../common/types/store-data/manual-test-status';
import { getStatusForTest } from '../../../../../../DetailsView/components/left-nav/get-status-for-test';

describe('getStatusForTest', () => {
    it('should return unknown', () => {
        const givenStats: RequirementOutcomeStats = {
            incomplete: 1,
        } as RequirementOutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.UNKNOWN);
    });

    it('should return fail', () => {
        const givenStats: RequirementOutcomeStats = {
            incomplete: 0,
            fail: 1,
        } as RequirementOutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.FAIL);
    });

    it('should return pass', () => {
        const givenStats: RequirementOutcomeStats = {
            fail: 0,
            incomplete: 0,
        } as RequirementOutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.PASS);
    });
});
