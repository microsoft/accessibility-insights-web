// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';
import { AssessmentsProvider } from './types/assessments-provider';
import { Assessment } from './types/iassessment';
import { Requirement } from './types/requirement';

export class AssessmentsProviderImpl implements AssessmentsProvider {
    private assessments: Assessment[];
    public static Create(assessments: Assessment[]): AssessmentsProvider {
        const provider = new AssessmentsProviderImpl();
        provider.assessments = assessments.slice();
        return provider;
    }

    public all(): Assessment[] {
        return this.assessments.slice();
    }

    public forType(visualizationType: VisualizationType): Assessment {
        return this.all().find(a => a.visualizationType === visualizationType);
    }

    public isValidType(visualizationType: VisualizationType): boolean {
        return this.forType(visualizationType) != null;
    }

    public forKey(key: string): Assessment {
        return this.all().find(a => a.key === key);
    }

    public forRequirementKey(key: string): Assessment {
        return this.all().find(a => a.requirements.find(r => r.key === key));
    }

    public isValidKey(key: string): boolean {
        return this.forKey(key) != null;
    }

    public getStep(visualizationType: VisualizationType, key: string): Requirement {
        const assessment = this.forType(visualizationType);
        if (!assessment) {
            return null;
        }
        const steps = assessment.requirements;
        const index = steps.findIndex(s => s.key === key);
        if (index === -1) {
            return null;
        }
        return { ...steps[index] };
    }

    public getStepMap(visualizationType: VisualizationType): DictionaryStringTo<Requirement> {
        const assessment = this.forType(visualizationType);
        if (!assessment) {
            return null;
        }
        const steps = assessment.requirements;

        return steps.reduce((map, step) => {
            map[step.key] = { ...step };
            return map;
        }, {});
    }
}
