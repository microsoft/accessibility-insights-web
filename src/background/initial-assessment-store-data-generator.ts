// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { head } from 'lodash';

import { Assessment } from '../assessments/types/iassessment';
import { AssessmentsProvider } from '../assessments/types/iassessments-provider';
import { Requirement } from '../assessments/types/requirement';
import { IAssessmentData, IAssessmentStoreData, PersistedTabInfo } from '../common/types/store-data/iassessment-result-data';
import { DictionaryStringTo } from '../types/common-types';
import { createInitialAssessmentTestData } from './create-initial-assessment-test-data';

export class InitialAssessmentStoreDataGenerator {
    private readonly NULL_FIRST_TEST: Partial<Readonly<Assessment>> = { type: null, requirements: [{ key: null }] as Requirement[] };
    private tests: ReadonlyArray<Readonly<Assessment>>;

    constructor(assessmentsProvider: AssessmentsProvider) {
        this.tests = assessmentsProvider.all();
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
            assessmentData[test.key] = createInitialAssessmentTestData(test, persistedTestData);
        });

        return assessmentData;
    }
}
