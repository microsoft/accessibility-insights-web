// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';

describe('filter by feature flag', () => {
    const assessments: Assessment[] = [
        { key: 'x', featureFlag: { required: ['x'] } } as Assessment,
        { key: 'y', featureFlag: { required: ['y'] } } as Assessment,
        { key: 'x & y', featureFlag: { required: ['x', 'y'] } } as Assessment,
        { key: 'empty', featureFlag: { required: [] } } as Assessment,
        { key: 'missing' } as Assessment,
    ];

    const baseProvider = AssessmentsProviderImpl.Create(assessments);
    const create = flags =>
        assessmentsProviderWithFeaturesEnabled(baseProvider, flags);

    test('none enabled', () => {
        const provider = create({});
        const keys = provider.all().map(p => p.key);
        expect(keys).toEqual(['empty', 'missing']);
    });

    test('x enabled', () => {
        const provider = create({ x: true });
        const keys = provider.all().map(p => p.key);
        expect(keys).toEqual(['x', 'empty', 'missing']);
    });

    test('y enabled', () => {
        const provider = create({ y: true });
        const keys = provider.all().map(p => p.key);
        expect(keys).toEqual(['y', 'empty', 'missing']);
    });

    test('x & y enabled', () => {
        const provider = create({ x: true, y: true });
        const keys = provider.all().map(p => p.key);
        expect(keys).toEqual(['x', 'y', 'x & y', 'empty', 'missing']);
    });
});
