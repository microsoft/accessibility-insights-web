// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { OutcomeMath } from 'reports/components/outcome-math';

describe('OutcomeMath', () => {
    const { sum, weightedPercentage, percentageComplete } = OutcomeMath;

    const statArray = [
        { pass: 1, fail: 2, incomplete: 1 },
        { pass: 0, fail: 1, incomplete: 1 },
    ];

    it('computes the sum', () => {
        expect(sum(statArray)).toEqual({ pass: 1, fail: 3, incomplete: 2 });
    });

    it('computes the weightedPercentage', () => {
        expect(weightedPercentage(statArray)).toEqual({
            pass: 13,
            fail: 50,
            incomplete: 37,
        });
    });

    it('computes percentageComplete', () => {
        expect(
            percentageComplete({ pass: 0, fail: 0, incomplete: 20 }),
        ).toEqual(0);
        expect(
            percentageComplete({ pass: 10, fail: 0, incomplete: 0 }),
        ).toEqual(100);
        expect(
            percentageComplete({ pass: 0, fail: 10, incomplete: 0 }),
        ).toEqual(100);
        expect(
            percentageComplete({ pass: 10, fail: 10, incomplete: 20 }),
        ).toEqual(50);
        expect(
            percentageComplete({ pass: null, fail: null, incomplete: 20 }),
        ).toEqual(0);
        expect(percentageComplete({ pass: 0, fail: 0, incomplete: 0 })).toEqual(
            NaN,
        );
    });
});
