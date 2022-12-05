// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';

export function assessmentsProviderForRequirements(
    assessmentProvider: AssessmentsProvider,
    requirementToVisualizationTypeMap: DictionaryStringTo<VisualizationType>,
): AssessmentsProvider {
    const assessments = assessmentProvider
        .all()
        .map(assessment => {
            let type: VisualizationType;
            const requirements = assessment.requirements.filter(req => {
                if (requirementToVisualizationTypeMap[req.key]) {
                    type = requirementToVisualizationTypeMap[req.key];
                    return true;
                }
                return false;
            });

            return {
                ...assessment,
                requirements,
                visualizationType: type,
            };
        })
        .filter(assessment => assessment.requirements.length > 0);

    const mediumPassAutomatedChecks = { ...AutomatedChecks };
    mediumPassAutomatedChecks.visualizationType = VisualizationType.AutomatedChecksMediumPass;
    assessments.unshift(mediumPassAutomatedChecks);

    return AssessmentsProviderImpl.Create(assessments);
}
