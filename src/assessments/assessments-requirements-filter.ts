// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { Assessment } from 'assessments/types/iassessment';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';

export function assessmentsProviderForRequirements(
    assessmentProvider: AssessmentsProvider,
    requirementToVisualizationTypeMap: DictionaryStringTo<VisualizationType>,
): AssessmentsProvider {
    const assessments: Assessment[] = assessmentProvider.all().reduce((accumulator, assessment) => {
        // This is a filterMap operation; it can be simplified if/when lodash merges
        // https://github.com/lodash/lodash/issues/5300
        const filteredRequirements = assessment.requirements.filter(
            req => requirementToVisualizationTypeMap[req.key] != null,
        );
        if (filteredRequirements.length > 0) {
            const lastRequirement = filteredRequirements[filteredRequirements.length - 1];
            const visualizationType = requirementToVisualizationTypeMap[lastRequirement.key];

            accumulator.push({
                ...assessment,
                requirements: filteredRequirements,
                visualizationType,
            });
        }
        return accumulator;
    }, [] as Assessment[]);

    const quickAssessAutomatedChecks = { ...AutomatedChecks };
    quickAssessAutomatedChecks.visualizationType = VisualizationType.AutomatedChecksQuickAssess;
    assessments.unshift(quickAssessAutomatedChecks);

    return AssessmentsProviderImpl.Create(assessments);
}
