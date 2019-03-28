// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty, pick } from 'lodash';

import { Assessment } from '../assessments/types/iassessment';
import { ManualTestStatus, ManualTestStatusData, TestStepData } from '../common/types/manual-test-status';
import {
    IAssessmentData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    InstanceIdToInstanceDataMap,
    RequirementIdToResultMap,
} from '../common/types/store-data/iassessment-result-data';
import { DictionaryStringTo } from '../types/common-types';

export type InitialDataCreator = (test: Readonly<Assessment>, persistedTest: IAssessmentData) => IAssessmentData;

export const createInitialAssessmentTestData: InitialDataCreator = (test: Readonly<Assessment>, persistedTest: IAssessmentData) => {
    const requirements = test.steps.map(val => val.key);
    if (persistedTest) {
        return getInitialTestDataUsingPersistedData(
            requirements,
            persistedTest.testStepStatus,
            persistedTest.manualTestStepResultMap,
            persistedTest.generatedAssessmentInstancesMap,
        );
    }

    return getDefaultInitialTestData(requirements);
};

export const createAutomatedChecksInitialAssessmentTestData: InitialDataCreator = (
    test: Readonly<Assessment>,
    persistedTest: IAssessmentData,
) => {
    const requirements = test.steps.map(val => val.key);
    if (persistedTest && allRequirementsAreScanned(requirements, persistedTest)) {
        return getInitialTestDataUsingPersistedData(
            requirements,
            persistedTest.testStepStatus,
            persistedTest.manualTestStepResultMap,
            persistedTest.generatedAssessmentInstancesMap,
        );
    }

    return getDefaultInitialTestData(requirements);
};

function getDefaultInitialTestData(requirements: string[]): IAssessmentData {
    return getInitialTestDataUsingPersistedData(requirements, {}, {}, null);
}

function getInitialTestDataUsingPersistedData(
    requirements: string[],
    persistedRequirementsStatus: ManualTestStatusData,
    persistedManualMap: RequirementIdToResultMap,
    persistedGeneratedMap: InstanceIdToInstanceDataMap,
): IAssessmentData {
    const testData: IAssessmentData = getDefaultTestResult();
    testData.testStepStatus = constructRequirementStatus(requirements, persistedRequirementsStatus);
    testData.manualTestStepResultMap = constructManualRequirementResultMap(requirements, persistedManualMap);
    testData.generatedAssessmentInstancesMap = constructGeneratedAssessmentInstancesMap(requirements, persistedGeneratedMap);
    return testData;
}

function allRequirementsAreScanned(requirements: string[], persistedTest: IAssessmentData): boolean {
    return requirements.every(
        requirement => persistedTest.testStepStatus[requirement] && persistedTest.testStepStatus[requirement].isStepScanned === true,
    );
}

function getDefaultTestResult(): IAssessmentData {
    return { fullAxeResultsMap: null, generatedAssessmentInstancesMap: null, manualTestStepResultMap: {}, testStepStatus: {} };
}

function getDefaultRequirementStatus(): TestStepData {
    return { stepFinalResult: ManualTestStatus.UNKNOWN, isStepScanned: false };
}

function getDefaultManualRequirementResult(step: string): IManualTestStepResult {
    return { status: ManualTestStatus.UNKNOWN, id: step, instances: [] };
}

function constructRequirementStatus(requirements: string[], persistedMap: ManualTestStatusData): ManualTestStatusData {
    return constructMapFromRequirementTo<TestStepData>(requirements, persistedMap, getDefaultRequirementStatus);
}

function constructManualRequirementResultMap(requirements: string[], persistedMap: RequirementIdToResultMap): RequirementIdToResultMap {
    return constructMapFromRequirementTo<IManualTestStepResult>(requirements, persistedMap, getDefaultManualRequirementResult);
}

function constructMapFromRequirementTo<T>(
    requirements: string[],
    persistedMap: DictionaryStringTo<T>,
    getDefaultData: (req: string) => T,
): DictionaryStringTo<T> {
    const map: DictionaryStringTo<T> = {};
    requirements.forEach(requirement => {
        map[requirement] = (persistedMap && persistedMap[requirement]) || getDefaultData(requirement);
    });

    return map;
}

function constructGeneratedAssessmentInstancesMap(
    requirements: string[],
    persistedMap: InstanceIdToInstanceDataMap,
): InstanceIdToInstanceDataMap {
    const map: InstanceIdToInstanceDataMap = {};
    if (isEmpty(persistedMap)) {
        return null;
    }
    Object.keys(persistedMap).forEach(instanceId => {
        const instanceData: IGeneratedAssessmentInstance = persistedMap[instanceId];
        const filteredResultMap = pick(instanceData.testStepResults, requirements);
        if (!isEmpty(filteredResultMap)) {
            instanceData.testStepResults = filteredResultMap;
            map[instanceId] = instanceData;
        }
    });
    if (isEmpty(map)) {
        return null;
    }
    return map;
}
