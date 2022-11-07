// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';

describe('filter by requirements', () => {
    const assessments: Assessment[] = [
        {
            key: 'a-and-b',
            requirements: [{ key: 'a' }, { key: 'b' }],
        } as Assessment,
        { key: 'c', requirements: [{ key: 'c' }] } as Assessment,
        {
            key: 'd-and-e-and-f',
            requirements: [{ key: 'd' }, { key: 'e' }, { key: 'f' }],
        } as Assessment,
        { key: 'none', requirements: [] } as Assessment,
    ];

    let baseProvider: AssessmentsProvider;
    let create: (requirements) => AssessmentsProvider;

    beforeEach(() => {
        baseProvider = AssessmentsProviderImpl.Create(assessments);
        create = requirements => assessmentsProviderForRequirements(baseProvider, requirements);
    });

    it.each`
        name                      | requirements                      | keys
        ${'only one requirement'} | ${['c']}                          | ${['automated-checks', 'c']}
        ${'all requirements'}     | ${['a', 'b', 'c', 'd', 'e', 'f']} | ${['automated-checks', 'a-and-b', 'c', 'd-and-e-and-f']}
        ${'empty requirements'}   | ${[]}                             | ${['automated-checks']}
    `(
        'for case $name contains only automated checks and assessments with the included requirements',
        ({ requirements, keys }) => {
            const testSubject = create(requirements);
            const containsOnlyIncludedRequirements = assessment => {
                return assessment.key === 'automated-checks'
                    ? true
                    : assessment.requirements.every(requirement =>
                          requirements.includes(requirement.key),
                      );
            };
            const allAssessments = testSubject.all();
            expect(testSubject.forKey('automated-checks')).toStrictEqual(AutomatedChecks);
            expect(allAssessments.every(containsOnlyIncludedRequirements)).toBe(true);
            const assessmentKeys = allAssessments.map(a => a.key);
            expect(assessmentKeys).toMatchObject(keys);
        },
    );
});
