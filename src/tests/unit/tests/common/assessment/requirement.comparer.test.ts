// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { sortBy } from 'lodash';

import { RequirementResult } from '../../../../../common/assessment/requirement';
import { RequirementComparer } from '../../../../../common/assessment/requirement-comparer';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';

describe('RequirementComparer', () => {
    const items = [
        {
            definition: { name: 'Three', order: 3 },
            data: { stepFinalResult: ManualTestStatus.FAIL },
        },
        {
            definition: { name: 'One', order: 1 },
            data: { stepFinalResult: ManualTestStatus.FAIL },
        },
        {
            definition: { name: 'Two', order: 2 },
            data: { stepFinalResult: ManualTestStatus.PASS },
        },
        {
            definition: { name: 'Four', order: 4 },
            data: { stepFinalResult: ManualTestStatus.PASS },
        },
    ] as Partial<RequirementResult>[] as RequirementResult[];

    it('orders byOrdinal', () => {
        const result = sortBy(items, RequirementComparer.byOrdinal);

        expect(result.map(r => r.definition.name)).toEqual(['One', 'Two', 'Three', 'Four']);
    });

    it('orders byName', () => {
        const result = sortBy(items, RequirementComparer.byName);

        expect(result.map(r => r.definition.name)).toEqual(['Four', 'One', 'Three', 'Two']);
    });

    it('orders byOutcome', () => {
        const result = sortBy(items, RequirementComparer.byOutcome);

        expect(result.map(r => r.definition.name)).toEqual(['Three', 'One', 'Two', 'Four']);
    });

    it('orders byOutcomeAndName', () => {
        const result = sortBy(items, RequirementComparer.byOutcomeAndName);

        expect(result.map(r => r.definition.name)).toEqual(['One', 'Three', 'Four', 'Two']);
    });
});
