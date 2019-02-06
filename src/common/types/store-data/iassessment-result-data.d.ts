// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from '../visualization-type';
import { IManualTestStatus, ManualTestStatus } from '../manual-test-status';
import { ITab } from './common/itab';

export type TestStepInstance = IUserCapturedInstance & IGeneratedAssessmentInstance;

export interface IAssessmentStoreData {
    targetTab: ITab;
    assessments: {
        [key: string]: IAssessmentData;
    };
    assessmentNavState: IAssessmentNavState;
}

export type InstanceIdToInstanceDataMap = IDictionaryStringTo<IGeneratedAssessmentInstance>;
export type RequirementIdToResultMap = IDictionaryStringTo<IManualTestStepResult>;

export interface IAssessmentData {
    fullAxeResultsMap;
    generatedAssessmentInstancesMap?: InstanceIdToInstanceDataMap;
    manualTestStepResultMap?: RequirementIdToResultMap;
    testStepStatus: IManualTestStatus;
}

export interface IManualTestStepResult {
    status: ManualTestStatus;
    id: string;
    instances: IUserCapturedInstance[];
}

export interface IUserCapturedInstance {
    id: string;
    description: string;
    html?: string;
    selector?: string;
}

export interface IGeneratedAssessmentInstance<T = {}, K = {}> {
    target: string[];
    html: string;
    testStepResults: IAssessmentResultType<K>;
    propertyBag?: T;
}

export interface ITestStepResult {
    id: string;
    status: ManualTestStatus;
    isCapturedByUser: boolean;
    failureSummary: string;
    isVisualizationEnabled: boolean;
    isVisible: boolean;
    originalStatus?: ManualTestStatus;
}

export interface IAssessmentNavState {
    selectedTestStep: string;
    selectedTestType: VisualizationType;
}

export interface IHeadingsAssessmentProperties {
    headingLevel: string;
    headingText: string;
}

export interface IFrameAssessmentProperties {
    frameType: string;
    frameTitle?: string;
}

export interface ILandmarksAssessmentProperties {
    role: string;
    label: string;
}

export type IAssessmentInstancesMap<T = {}, K = {}> = IDictionaryStringTo<IGeneratedAssessmentInstance<T, K>>;
export type IAssessmentResultType<K> = { [testStepName in keyof K]: ITestStepResult };
