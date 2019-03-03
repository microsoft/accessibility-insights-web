// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { head, isEmpty, pick } from 'lodash/index';

import { Assessment } from '../assessments/types/iassessment';
import { TestStep } from '../assessments/types/test-step';
import { IManualTestStatus, ManualTestStatus } from '../common/types/manual-test-status';
import { IAssessmentsProvider } from './../assessments/types/iassessments-provider';
import { ITestStepData } from './../common/types/manual-test-status';
import {
    InstanceIdToInstanceDataMap,
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    RequirementIdToResultMap,
    PersistedTabInfo,
} from '../common/types/store-data/iassessment-result-data';

export class InitialAssessmentStoreDataGenerator {
    private readonly NULL_FIRST_TEST: Partial<Readonly<Assessment>> = { type: null, steps: [{ key: null }] as TestStep[] };
    private tests: ReadonlyArray<Readonly<Assessment>>;
    private assessmentsProvider: IAssessmentsProvider;

    constructor(assessmentsProvider: IAssessmentsProvider) {
        this.assessmentsProvider = assessmentsProvider;
        this.tests = this.assessmentsProvider.all();
    }

    public generateInitalState(persistedData: IAssessmentStoreData = null): IAssessmentStoreData {
        const targetTab: PersistedTabInfo = persistedData &&
            persistedData.persistedTabInfo && { ...persistedData.persistedTabInfo, appRefreshed: true };
        const persistedTests = persistedData && persistedData.assessments;
        // defaulting this.tests values to null instead of doing multiple if
        const first = head(this.tests) || this.NULL_FIRST_TEST;
        const selectedTestType = first.type;
        const selectedTestStep = first.steps && first.steps[0] && first.steps[0].key;

        const state: Partial<IAssessmentStoreData> = {
            persistedTabInfo: targetTab,
            assessmentNavState: { selectedTestType: selectedTestType, selectedTestStep: selectedTestStep },
            assessments: this.constructInitialDataForAssessment(persistedTests),
        };

        return state as IAssessmentStoreData;
    }

    private constructInitialDataForAssessment(persistedTests: { [key: string]: IAssessmentData } = null) {
        const assessmentData: { [key: string]: IAssessmentData } = {};

        this.tests.forEach(test => {
            const persistedTestData = persistedTests && persistedTests[test.key];
            assessmentData[test.key] = this.constructInitialDataForTest(test, persistedTestData);
        });

        return assessmentData;
    }

    private constructInitialDataForTest(test: Readonly<Assessment>, persistedTest: IAssessmentData): IAssessmentData {
        const requirements = test.steps.map(val => val.key);
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

    private constructRequirementStatus(requirements: string[], persistedMap: IManualTestStatus): IManualTestStatus {
        return this.constructMapFromRequirementTo<ITestStepData>(requirements, persistedMap, this.getDefaultRequirementStatus);
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
        persistedMap: IDictionaryStringTo<T>,
        getDefaultData: (req: string) => T,
    ) {
        const map: IDictionaryStringTo<T> = {};
        requirements.forEach(requirement => {
            map[requirement] = (persistedMap && persistedMap[requirement]) || getDefaultData(requirement);
        });

        return map;
    }

    private getDefaultTestResult(): IAssessmentData {
        return { fullAxeResultsMap: null, generatedAssessmentInstancesMap: null, manualTestStepResultMap: {}, testStepStatus: {} };
    }

    private getDefaultRequirementStatus(): ITestStepData {
        return { stepFinalResult: ManualTestStatus.UNKNOWN, isStepScanned: false };
    }

    private getDefaultManualRequirementResult(step: string): IManualTestStepResult {
        return { status: ManualTestStatus.UNKNOWN, id: step, instances: [] };
    }
}
