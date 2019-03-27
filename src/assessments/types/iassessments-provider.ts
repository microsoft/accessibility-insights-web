// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../../common/types/visualization-type';
import { DictionaryStringTo } from './../../types/common-types';
import { Assessment } from './iassessment';
import { TestStep } from './test-step';

export interface AssessmentsProvider {
    all(): ReadonlyArray<Readonly<Assessment>>;
    isValidType(type: VisualizationType): boolean;
    forType(type: VisualizationType): Readonly<Assessment>;
    isValidKey(key: string): boolean;
    forKey(key: string): Readonly<Assessment>;
    getStep(type: VisualizationType, key: string): Readonly<TestStep>;
    getStepMap(type: VisualizationType): Readonly<DictionaryStringTo<Readonly<TestStep>>>;
}
