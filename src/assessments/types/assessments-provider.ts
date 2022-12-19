// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { DictionaryStringTo } from 'types/common-types';
import { Assessment } from './iassessment';
import { Requirement } from './requirement';

export interface AssessmentsProvider {
    all(): ReadonlyArray<Readonly<Assessment>>;
    isValidType(visualizationType: VisualizationType): boolean;
    forType(visualizationType: VisualizationType): Readonly<Assessment> | undefined;
    isValidKey(key: string): boolean;
    forKey(key: string): Readonly<Assessment> | undefined;
    forRequirementKey(key: string): Readonly<Assessment> | undefined;
    getStep(visualizationType: VisualizationType, key: string): Readonly<Requirement> | null;
    getStepMap(
        visualizationType: VisualizationType,
    ): Readonly<DictionaryStringTo<Readonly<Requirement>>> | null;
}
