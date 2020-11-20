// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { needsReviewResultsFilter } from 'electron/platform/android/test-configs/needs-review/results-filter';

describe('needsReviewResultsFilter', () => {
    it('filters out non-unknown results', () => {
        const testResults = [
            { status: 'pass' },
            { status: 'fail' },
            { status: 'unknown' },
            { status: 'fail' },
            { status: 'fail' },
            { status: 'pass' },
            { status: 'unknown' },
        ] as UnifiedResult[];

        const filteredResults = testResults.filter(needsReviewResultsFilter);

        expect(filteredResults).toEqual([{ status: 'unknown' }, { status: 'unknown' }]);
    });
});
