// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { head, isEmpty, pick } from 'lodash';

import { Assessment } from '../assessments/types/iassessment';
import { Requirement } from '../assessments/types/requirement';
import { ManualTestStatus, ManualTestStatusData } from '../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    InstanceIdToInstanceDataMap,
    PersistedTabInfo,
    RequirementIdToResultMap,
} from '../common/types/store-data/iassessment-result-data';
import { DictionaryStringTo } from '../types/common-types';
import { AssessmentsProvider } from './../assessments/types/iassessments-provider';
import { TestStepData } from './../common/types/manual-test-status';

export class InitialAssessmentStoreDataGenerator {
    private readonly NULL_FIRST_TEST: Partial<Readonly<Assessment>> = { type: null, requirements: [{ key: null }] as Requirement[] };
    private tests: ReadonlyArray<Readonly<Assessment>>;
    private assessmentsProvider: AssessmentsProvider;

    constructor(assessmentsProvider: AssessmentsProvider) {
        this.assessmentsProvider = assessmentsProvider;
        this.tests = this.assessmentsProvider.all();
    }

    public generateInitialState(persistedData: IAssessmentStoreData = null): IAssessmentStoreData {
        const targetTab: PersistedTabInfo = persistedData &&
            persistedData.persistedTabInfo && { ...persistedData.persistedTabInfo, appRefreshed: true };
        const persistedTests = persistedData && persistedData.assessments;
        // defaulting this.tests values to null instead of doing multiple if
        const first = head(this.tests) || this.NULL_FIRST_TEST;
        const selectedTestType = first.type;
        const selectedTestStep = first.requirements && first.requirements[0] && first.requirements[0].key;

        const state: Partial<IAssessmentStoreData> = {
            persistedTabInfo: targetTab,
            assessmentNavState: { selectedTestType: selectedTestType, selectedTestStep: selectedTestStep },
            assessments: this.constructInitialDataForAssessment(persistedTests),
        };

        return state as IAssessmentStoreData;
    }

    private constructInitialDataForAssessment(
        persistedTests: DictionaryStringTo<IAssessmentData> = null,
    ): DictionaryStringTo<IAssessmentData> {
        const assessmentData: DictionaryStringTo<IAssessmentData> = {};

        this.tests.forEach(test => {
            const persistedTestData = persistedTests && persistedTests[test.key];
            assessmentData[test.key] = this.constructInitialDataForTest(test, persistedTestData);
        });

        return assessmentData;
    }

    private constructInitialDataForTest(test: Readonly<Assessment>, persistedTest: IAssessmentData): IAssessmentData {
        const requirements = test.requirements.map(val => val.key);
        const testData: IAssessmentData = this.getDefaultTestResult();
        const persistedRequirementsStatus = persistedTest && persistedTest.testStepStatus;
        const persistedManualMap = persistedTest && persistedTest.manualTestStepResultMap;
        const persistedGeneratedMap = persistedTest && persistedTest.generatedAssessmentInstancesMap;
        testData.testStepStatus = this.constructRequirementStatus(requirements, persistedRequirementsStatus);
        testData.manualTestStepResultMap = this.constructManualRequirementResultMap(requirements, persistedManualMap);
        testData.generatedAssessmentInstancesMap = this.constructGeneratedAssessmentInstancesMap(requirements, persistedGeneratedMap);

        return testData;
    }

    private constructGeneratedAssessmentInstancesMap(
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

    private constructRequirementStatus(requirements: string[], persistedMap: ManualTestStatusData): ManualTestStatusData {
        return this.constructMapFromRequirementTo<TestStepData>(requirements, persistedMap, this.getDefaultRequirementStatus);
    }

    private constructManualRequirementResultMap(requirements: string[], persistedMap: RequirementIdToResultMap): RequirementIdToResultMap {
        return this.constructMapFromRequirementTo<IManualTestStepResult>(
            requirements,
            persistedMap,
            this.getDefaultManualRequirementResult,
        );
    }

    private constructMapFromRequirementTo<T>(
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

    private getDefaultTestResult(): IAssessmentData {
        return { fullAxeResultsMap: null, generatedAssessmentInstancesMap: null, manualTestStepResultMap: {}, testStepStatus: {} };
    }

    private getDefaultRequirementStatus(): TestStepData {
        return { stepFinalResult: ManualTestStatus.UNKNOWN, isStepScanned: false };
    }

    private getDefaultManualRequirementResult(step: string): IManualTestStepResult {
        return { status: ManualTestStatus.UNKNOWN, id: step, instances: [] };
    }
}
