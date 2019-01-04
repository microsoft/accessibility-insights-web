// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../../common/types/visualization-type';
import { IAssessment } from './iassessment';
import { TestStep } from './test-step';

export interface IAssessmentsProvider {
    all(): ReadonlyArray<Readonly<IAssessment>>;
    isValidType(type: VisualizationType): boolean;
    forType(type: VisualizationType): Readonly<IAssessment>;
    isValidKey(key: string): boolean;
    forKey(key: string): Readonly<IAssessment>;
    getStep(type: VisualizationType, key: string): Readonly<TestStep>;
    getStepMap(type: VisualizationType): Readonly<IDictionaryStringTo<Readonly<TestStep>>>;
}
