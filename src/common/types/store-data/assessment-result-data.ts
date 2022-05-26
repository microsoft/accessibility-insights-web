// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { DictionaryStringTo } from '../../../types/common-types';
import { Tab } from '../../itab';
import { ManualTestStatus, ManualTestStatusData } from '../manual-test-status';
import { VisualizationType } from '../visualization-type';

export type TestStepInstance = UserCapturedInstance & GeneratedAssessmentInstance;
export type RequirementName = string;
export type GettingStarted = 'getting-started';

export const gettingStartedSubview: GettingStarted = 'getting-started';

export type PersistedTabInfo = Tab & {
    detailsViewId?: string;
};

export interface AssessmentStoreData {
    persistedTabInfo: PersistedTabInfo;
    assessments: {
        [key: string]: AssessmentData;
    };
    assessmentNavState: AssessmentNavState;
    resultDescription: string;
}

export type InstanceIdToInstanceDataMap = DictionaryStringTo<GeneratedAssessmentInstance>;
export type RequirementIdToResultMap = DictionaryStringTo<ManualTestStepResult>;

export interface AssessmentData {
    fullAxeResultsMap: any;
    generatedAssessmentInstancesMap?: InstanceIdToInstanceDataMap;
    manualTestStepResultMap?: RequirementIdToResultMap;
    testStepStatus: ManualTestStatusData;
    scanIncompleteWarnings?: ScanIncompleteWarningId[];
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
    testStepResults: AssessmentResultType<K>;
    propertyBag?: T;
}

export interface TestStepResult {
    id: string;
    status: ManualTestStatus;
    isCapturedByUser: boolean;
    failureSummary: string;
    isVisualizationSupported: boolean;
    isVisualizationEnabled: boolean;
    isVisible: boolean;
    originalStatus?: ManualTestStatus;
}

export interface AssessmentNavState {
    selectedTestSubview: RequirementName | GettingStarted;
    selectedTestType: VisualizationType;
    expandedTestType?: VisualizationType;
}

export interface HeadingsAssessmentProperties {
    headingLevel: string;
    headingText: string;
}

export interface FrameAssessmentProperties {
    frameType: string;
    frameTitle?: string;
}

export interface LandmarksAssessmentProperties {
    role: string;
    label: string;
}

export type AssessmentInstancesMap<T = {}, K = {}> = DictionaryStringTo<
    GeneratedAssessmentInstance<T, K>
>;

export type AssessmentResultType<K> = { [testStepName in keyof K]: TestStepResult };
