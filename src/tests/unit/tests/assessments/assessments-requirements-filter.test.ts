// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { VisualizationType } from 'common/types/visualization-type';

describe('filter by requirements', () => {
    const getVisualizationConfigurationStub = () => ({ key: 'some key' });
    const assessments: Assessment[] = [
        {
            key: 'a-and-b',
            requirements: [{ key: 'a' }, { key: 'b' }],
            getVisualizationConfiguration: getVisualizationConfigurationStub,
        } as Assessment,
        {
            key: 'c',
            requirements: [{ key: 'c' }],
            getVisualizationConfiguration: getVisualizationConfigurationStub,
        } as Assessment,
        {
            key: 'd-and-e-and-f',
            requirements: [{ key: 'd' }, { key: 'e' }, { key: 'f' }],
            getVisualizationConfiguration: getVisualizationConfigurationStub,
        } as Assessment,
        {
            key: 'none',
            requirements: [],
            getVisualizationConfiguration: getVisualizationConfigurationStub,
        } as Assessment,
    ];

    const requirementToVisualizationTypeStubs = [
        { c: -1 },
        { a: -1, b: -1, c: -2, d: -3, e: -3, f: -3 },
        {},
    ];

    let baseProvider: AssessmentsProvider;
    let create: (requirements) => AssessmentsProvider;

    beforeEach(() => {
        baseProvider = AssessmentsProviderImpl.Create(assessments);
        create = requirements => assessmentsProviderForRequirements(baseProvider, requirements);
    });

    it.each`
        name                      | requirements                              | keys
        ${'only one requirement'} | ${requirementToVisualizationTypeStubs[0]} | ${['automated-checks', 'c']}
        ${'all requirements'}     | ${requirementToVisualizationTypeStubs[1]} | ${['automated-checks', 'a-and-b', 'c', 'd-and-e-and-f']}
        ${'empty requirements'}   | ${requirementToVisualizationTypeStubs[2]} | ${['automated-checks']}
    `(
        'for case $name contains only automated checks and assessments with the included requirements',
        ({ requirements, keys }) => {
            const testSubject = create(requirements);
            const allAssessments = testSubject.all();
            const generatedAutomatedChecksAssessment = testSubject.forKey(AutomatedChecks.key);
            expect(generatedAutomatedChecksAssessment).toBeDefined();
            expect(generatedAutomatedChecksAssessment.key).toStrictEqual(AutomatedChecks.key);
            expect(generatedAutomatedChecksAssessment.visualizationType).toStrictEqual(
                VisualizationType.AutomatedChecksMediumPass,
            );

            const containsOnlyIncludedRequirements = (assessment: Assessment) => {
                return assessment.key === generatedAutomatedChecksAssessment.key
                    ? true
                    : assessment.requirements.every(
                          requirement => requirements[requirement.key] != null,
                      );
            };

            expect(allAssessments.every(containsOnlyIncludedRequirements)).toBe(true);
            verifyVisualizationConfiguration(baseProvider, allAssessments as Assessment[]);
            const assessmentKeys = allAssessments.map(a => a.key);
            expect(assessmentKeys).toMatchObject(keys);
        },
    );

    function verifyVisualizationConfiguration(
        baseProvider: AssessmentsProvider,
        createdAssessments: Assessment[],
    ) {
        createdAssessments.forEach(createdAssessment => {
            if (createdAssessment.key === AutomatedChecks.key) {
                return;
            }

            const baseAssessment = baseProvider.forKey(createdAssessment.key);
            const baseConfig = baseAssessment.getVisualizationConfiguration();
            const createdConfig = createdAssessment.getVisualizationConfiguration();
            expect(createdConfig).toMatchObject(baseConfig);
        });
    }
});
