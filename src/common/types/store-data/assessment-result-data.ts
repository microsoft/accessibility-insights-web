// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../../types/common-types';
import { Tab } from '../../itab';
import { ManualTestStatus, ManualTestStatusData } from '../manual-test-status';
import { VisualizationType } from '../visualization-type';

export type TestStepInstance = UserCapturedInstance & GeneratedAssessmentInstance;

export type PersistedTabInfo = Tab & {
    appRefreshed: boolean;
};

export interface AssessmentStoreData {
    persistedTabInfo: PersistedTabInfo;
    assessments: {
        [key: string]: AssessmentData;
    };
    assessmentNavState: AssessmentNavState;
}

export type InstanceIdToInstanceDataMap = DictionaryStringTo<GeneratedAssessmentInstance>;
export type RequirementIdToResultMap = DictionaryStringTo<ManualTestStepResult>;

export interface AssessmentData {
    fullAxeResultsMap: any;
    generatedAssessmentInstancesMap?: InstanceIdToInstanceDataMap;
    manualTestStepResultMap?: RequirementIdToResultMap;
    testStepStatus: ManualTestStatusData;
}

export interface ManualTestStepResult {
    status: ManualTestStatus;
    id: string;
    instances: UserCapturedInstance[];
}

export interface UserCapturedInstance {
    id: string;
    description: string;
    html?: string;
    selector?: string;
}

export interface GeneratedAssessmentInstance<T = {}, K = {}> {
    target: string[];
    html: string;
    testStepResults: IAssessmentResultType<K>;
    propertyBag?: T;
}

export interface TestStepResult {
    id: string;
    status: ManualTestStatus;
    isCapturedByUser: boolean;
    failureSummary: string;
    isVisualizationEnabled: boolean;
    isVisible: boolean;
    originalStatus?: ManualTestStatus;
}

export interface AssessmentNavState {
    selectedTestStep: string;
    selectedTestType: VisualizationType;
}

// tslint:disable-next-line:interface-name
export interface IHeadingsAssessmentProperties {
    headingLevel: string;
    headingText: string;
}

// tslint:disable-next-line:interface-name
export interface IFrameAssessmentProperties {
    frameType: string;
    frameTitle?: string;
}

// tslint:disable-next-line:interface-name
export interface ILandmarksAssessmentProperties {
    role: string;
    label: string;
}

// tslint:disable-next-line:interface-name
export type IAssessmentInstancesMap<T = {}, K = {}> = DictionaryStringTo<GeneratedAssessmentInstance<T, K>>;
// tslint:disable-next-line:interface-name
export type IAssessmentResultType<K> = { [testStepName in keyof K]: TestStepResult };
