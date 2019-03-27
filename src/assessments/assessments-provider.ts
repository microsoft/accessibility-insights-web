// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { Assessment } from './types/iassessment';
import { AssessmentsProvider } from './types/iassessments-provider';
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

    public forType(type: VisualizationType): Assessment {
        return this.all().find(a => a.type === type);
    }

    public isValidType(type: VisualizationType): boolean {
        return this.forType(type) != null;
    }

    public forKey(key: string): Assessment {
        return this.all().find(a => a.key === key);
    }

    public isValidKey(key: string): boolean {
        return this.forKey(key) != null;
    }

    public getStep(type: VisualizationType, key: string): Requirement {
        const assessment = this.forType(type);
        if (!assessment) {
            return null;
        }
        const steps = assessment.steps;
        const index = steps.findIndex(s => s.key === key);
        if (index === -1) {
            return null;
        }
        return { ...steps[index], order: index + 1 };
    }

    public getStepMap(type: VisualizationType): DictionaryStringTo<Requirement> {
        const assessment = this.forType(type);
        if (!assessment) {
            return null;
        }
        const steps = assessment.steps;

        let index = 1;
        return steps.reduce((map, step) => {
            map[step.key] = { ...step, order: index++ };
            return map;
        }, {});
    }
}
