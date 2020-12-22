// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GeneratedAssessmentInstance } from 'common/types/store-data/assessment-result-data';

export interface AssessmentInstanceRowData<P = {}> {
    key: string;
    statusChoiceGroup: JSX.Element;
    visualizationButton?: JSX.Element;
    instance: GeneratedAssessmentInstance<P>;
}

export interface InstanceTableColumn {
    key: string;
    name: string;
    onRender: (item: AssessmentInstanceRowData) => JSX.Element;
}
