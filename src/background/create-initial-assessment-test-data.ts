// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessment } from 'assessments/types/iassessment';
import {
    ManualTestStatus,
    ManualTestStatusData,
    TestStepData,
} from 'common/types/store-data/manual-test-status';
import { isEmpty, pick } from 'lodash';
import {
    AssessmentData,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
    ManualTestStepResult,
    RequirementIdToResultMap,
} from '../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../types/common-types';

export type InitialDataCreator = (
    test: Readonly<Assessment>,
    persistedTest: AssessmentData,
) => AssessmentData;

export const createInitialAssessmentTestData: InitialDataCreator = (
    test: Readonly<Assessment>,
    persistedTest: AssessmentData,
) => {
    const requirements = test.requirements.map(val => val.key);
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
    persistedTest: AssessmentData,
) => {
    const requirements = test.requirements.map(val => val.key);
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

function getDefaultInitialTestData(requirements: string[]): AssessmentData {
    return getInitialTestDataUsingPersistedData(requirements, {}, {}, undefined);
}

function getInitialTestDataUsingPersistedData(
    requirements: string[],
    persistedRequirementsStatus: ManualTestStatusData,
    persistedManualMap?: RequirementIdToResultMap,
    persistedGeneratedMap?: InstanceIdToInstanceDataMap,
): AssessmentData {
    const testData: AssessmentData = getDefaultTestResult();
    testData.testStepStatus = constructRequirementStatus(requirements, persistedRequirementsStatus);
    testData.manualTestStepResultMap = constructManualRequirementResultMap(
        requirements,
        persistedManualMap,
    );
    testData.generatedAssessmentInstancesMap = constructGeneratedAssessmentInstancesMap(
        requirements,
        persistedGeneratedMap,
    );
    return testData;
}

function allRequirementsAreScanned(requirements: string[], persistedTest: AssessmentData): boolean {
    return requirements.every(
        requirement =>
            persistedTest.testStepStatus[requirement] &&
            persistedTest.testStepStatus[requirement].isStepScanned === true,
    );
}

function getDefaultTestResult(): AssessmentData {
    return {
        fullAxeResultsMap: null,
        generatedAssessmentInstancesMap: undefined,
        manualTestStepResultMap: {},
        testStepStatus: {},
    };
}

function getDefaultRequirementStatus(): TestStepData {
    return { stepFinalResult: ManualTestStatus.UNKNOWN, isStepScanned: false };
}

function getDefaultManualRequirementResult(step: string): ManualTestStepResult {
    return { status: ManualTestStatus.UNKNOWN, id: step, instances: [] };
}

function constructRequirementStatus(
    requirements: string[],
    persistedMap: ManualTestStatusData,
): ManualTestStatusData {
    return constructMapFromRequirementTo<TestStepData>(
        requirements,
        persistedMap,
        getDefaultRequirementStatus,
    );
}

function constructManualRequirementResultMap(
    requirements: string[],
    persistedMap?: RequirementIdToResultMap,
): RequirementIdToResultMap {
    return constructMapFromRequirementTo<ManualTestStepResult>(
        requirements,
        persistedMap,
        getDefaultManualRequirementResult,
    );
}

function constructMapFromRequirementTo<T>(
    requirements: string[],
    persistedMap: DictionaryStringTo<T> | undefined,
    getDefaultData: (req: string) => T,
): DictionaryStringTo<T> {
    const map: DictionaryStringTo<T> = {};
    requirements.forEach(requirement => {
        map[requirement] =
            (persistedMap && persistedMap[requirement]) || getDefaultData(requirement);
    });

    return map;
}

function constructGeneratedAssessmentInstancesMap(
    requirements: string[],
    persistedMap?: InstanceIdToInstanceDataMap,
): InstanceIdToInstanceDataMap | undefined {
    const map: InstanceIdToInstanceDataMap = {};
    if (isEmpty(persistedMap)) {
        return undefined;
    }
    Object.keys(persistedMap).forEach(instanceId => {
        const instanceData: GeneratedAssessmentInstance = persistedMap[instanceId];
        const filteredResultMap = pick(instanceData.testStepResults, requirements);
        if (!isEmpty(filteredResultMap)) {
            instanceData.testStepResults = filteredResultMap;
            map[instanceId] = instanceData;
        }
    });
    if (isEmpty(map)) {
        return undefined;
    }
    return map;
}
