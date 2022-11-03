// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { assessmentsProviderForRequirements } from 'assessments/assessments-medium-pass-filter';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';

describe('filter by requirements', () => {
    const assessments: Assessment[] = [
        {
            key: 'x',
            featureFlag: { required: ['x'] },
            requirements: [{ key: 'a' }, { key: 'b' }],
        } as Assessment,
        { key: 'y', featureFlag: { required: ['y'] }, requirements: [{ key: 'c' }] } as Assessment,
        {
            key: 'x & y',
            featureFlag: { required: ['x', 'y'] },
            requirements: [{ key: 'd' }, { key: 'e' }],
        } as Assessment,
        { key: 'empty', featureFlag: { required: [] }, requirements: [] } as Assessment,
        { key: 'missing', requirements: [{ key: 'f' }, { key: 'g' }] } as Assessment,
    ];

    let baseProvider: AssessmentsProvider;
    let create: (flags, requirements) => AssessmentsProvider;

    beforeEach(() => {
        baseProvider = AssessmentsProviderImpl.Create(assessments);
        create = (flags, requirements) =>
            assessmentsProviderForRequirements(baseProvider, flags, requirements);
    });

    it.each`
        name                                         | requirements                      | flags
        ${'only one requirement'}                    | ${['c']}                          | ${{ x: true, y: true }}
        ${'all requirements'}                        | ${['a', 'b', 'c', 'd', 'e', 'f']} | ${{ x: true, y: true }}
        ${'all requirements with featureFlag false'} | ${['a', 'b', 'c', 'd', 'e', 'f']} | ${{ x: false, y: true }}
        ${'all requirements with no feature flags'}  | ${['a', 'b', 'c', 'd', 'e', 'f']} | ${{}}
        ${'empty requirements'}                      | ${[]}                             | ${{ x: true, y: true }}
    `(
        'for case $name contains only automated checks and assessments with the included requirements',
        ({ flags, requirements }) => {
            const testSubject = create(flags, requirements);
            const containsOnlyIncludedRequirements = assessment => {
                return assessment.key === 'automated-checks'
                    ? true
                    : assessment.requirements.every(requirement =>
                          requirements.includes(requirement.key),
                      );
            };
            const excludesDisabledFlags = assessment => {
                return assessment.featureFlag
                    ? assessment.featureFlag.required.every(key => flags[key] === true)
                    : true;
            };
            expect(testSubject.forKey('automated-checks')).toStrictEqual(AutomatedChecks);
            expect(testSubject.all().every(containsOnlyIncludedRequirements)).toBe(true);
            expect(testSubject.all().every(excludesDisabledFlags)).toBe(true);
            expect(testSubject.all()).toMatchSnapshot();
        },
    );
});
