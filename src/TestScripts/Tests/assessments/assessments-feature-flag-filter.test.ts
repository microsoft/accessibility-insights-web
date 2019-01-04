// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../../../assessments/assessments-provider';
import { IAssessment } from '../../../assessments/types/iassessment';
import { assessmentsProviderWithFeaturesEnabled } from '../../../assessments/assessments-feature-flag-filter';

describe('filter by feature flag', () => {
    const assessments: IAssessment[] = [
        { key: 'x', featureFlag: { required: ['x'] } } as IAssessment,
        { key: 'y', featureFlag: { required: ['y'] } } as IAssessment,
        { key: 'x & y', featureFlag: { required: ['x', 'y'] } } as IAssessment,
        { key: 'empty', featureFlag: { required: [] } } as IAssessment,
        { key: 'missing' } as IAssessment,
    ];

    const baseProvider = AssessmentsProvider.Create(assessments);
    const create = flags => assessmentsProviderWithFeaturesEnabled(baseProvider, flags);

    test('none enabled', () => {
        const provider = create({ });
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
