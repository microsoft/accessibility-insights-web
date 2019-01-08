// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import { getStatusForTest } from '../../../../../../DetailsView/components/left-nav/get-status-for-test';
import { OutcomeStats } from '../../../../../../DetailsView/reports/components/outcome-type';

describe('getStatusForTest', () => {
    it('should return unknown', () => {
        const givenStats: OutcomeStats = {
            incomplete: 1,
        } as OutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.UNKNOWN);
    });

    it('should return fail', () => {
        const givenStats: OutcomeStats = {
            incomplete: 0,
            fail: 1,
        } as OutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.FAIL);
    });

    it('should return pass', () => {
        const givenStats: OutcomeStats = {
            fail: 0,
            incomplete: 0,
        } as OutcomeStats;

        expect(getStatusForTest(givenStats)).toEqual(ManualTestStatus.PASS);
    });
});
