// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { automatedChecksResultsFilter } from 'electron/platform/android/test-configs/automated-checks/results-filter';

describe('automatedChecksResultsFilter', () => {
    it('filters results properly', () => {
        const testResults = [
            { status: 'pass' },
            { status: 'fail' },
            { status: 'unknown' },
            { status: 'fail' },
            { status: 'fail' },
            { status: 'pass' },
            { status: 'unknown' },
        ] as UnifiedResult[];

        const filteredResults = testResults.filter(automatedChecksResultsFilter);

        expect(filteredResults).toMatchSnapshot();
    });
});
