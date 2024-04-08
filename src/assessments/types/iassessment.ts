// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InitialDataCreator } from 'background/create-initial-assessment-test-data';
import { AssessmentVisualizationConfiguration } from 'common/configs/assessment-visualization-configuration';
import { AnyExtension } from 'common/extensibility/extension-point';
import { VisualizationType } from 'common/types/visualization-type';
import {
    TestViewContainerProvider,
    TestViewContainerProviderProps,
} from 'DetailsView/components/test-view-container-provider';
import { ContentPageComponent } from 'views/content/content-page';
import { Requirement } from './requirement';

interface BaseAssessment {
    key: string;
    visualizationType: VisualizationType;
    title: string;
    subtitle?: JSX.Element;
    gettingStarted: JSX.Element;
    guidance?: ContentPageComponent;
    requirements: Requirement[];
    featureFlag?: { required?: string[] };
    extensions?: AnyExtension[];
    initialDataCreator?: InitialDataCreator;
    isNonCollapsible?: boolean;
    isEnabled?: boolean;
}

export interface ManualAssessment extends BaseAssessment {}

export interface AssistedAssessment extends BaseAssessment {
    visualizationConfiguration?: Partial<AssessmentVisualizationConfiguration>;
    getTestViewContainer?: (
        provider: TestViewContainerProvider,
        props: TestViewContainerProviderProps,
    ) => JSX.Element;
}

export interface Assessment extends BaseAssessment {
    getVisualizationConfiguration: () => AssessmentVisualizationConfiguration;
}
