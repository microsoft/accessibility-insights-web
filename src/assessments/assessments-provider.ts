// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessment } from './types/iassessment';
import { IAssessmentsProvider } from './types/iassessments-provider';
import { VisualizationType } from '../common/types/visualization-type';
import { TestStep } from './types/test-step';

export class AssessmentsProvider implements IAssessmentsProvider {
    private assessments: IAssessment[];
    public static Create(assessments: IAssessment[]): IAssessmentsProvider {
        const provider = new AssessmentsProvider();
        provider.assessments = assessments.slice();
        return provider;
    }

    public all(): IAssessment[] {
        return this.assessments.slice();
    }

    public forType(type: VisualizationType): IAssessment {
        return this.all().find(a => a.type === type);
    }

    public isValidType(type: VisualizationType): boolean {
        return this.forType(type) != null;
    }

    public forKey(key: string): IAssessment {
        return this.all().find(a => a.key === key);
    }

    public isValidKey(key: string): boolean {
        return this.forKey(key) != null;
    }

    public getStep(type: VisualizationType, key: string): TestStep {
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

    public getStepMap(type: VisualizationType): IDictionaryStringTo<TestStep> {
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
