// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RequirementOrdering } from '../../common/assessment/requirement';
import { IAssesssmentVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { AnyExtension } from '../../common/extensibility/extension-point';
import { IAssessmentData } from '../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { ContentPageComponent } from '../../views/content/content-page';
import { TestStep } from './test-step';

export interface IBaseAssessment {
    key: string;
    type: VisualizationType;
    title: string;
    gettingStarted: JSX.Element;
    guidance?: ContentPageComponent;
    steps: TestStep[];
    featureFlag?: { required?: string[] };
    executeAssessmentScanPolicy?: (scheduleScan: (step: string) => void, data: IAssessmentData) => void;
    requirementOrder?: RequirementOrdering;
    extensions?: AnyExtension[];
}

export interface IManualAssessment extends IBaseAssessment {}

export interface IAssistedAssessment extends IBaseAssessment {
    storeDataKey: string;
    visualizationConfiguration?: Partial<IAssesssmentVisualizationConfiguration>;
}

export interface IAssessment extends IBaseAssessment {
    getVisualizationConfiguration: () => IAssesssmentVisualizationConfiguration;
    requirementOrder: RequirementOrdering;
}
