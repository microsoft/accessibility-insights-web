// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationType } from 'common/types/visualization-type';
import {
    deprecatedVisualizationTypes,
    deprecatedAssessmentKeys,
} from 'common/visualization-type-helper';
import { head } from 'lodash';
import {
    AssessmentData,
    AssessmentStoreData,
    PersistedTabInfo,
} from '../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../types/common-types';

export class InitialAssessmentStoreDataGenerator {
    private readonly NULL_FIRST_TEST: Partial<Readonly<Assessment>> = {
        visualizationType: null,
        requirements: [{ key: null }] as Requirement[],
    };

    constructor(private readonly tests: ReadonlyArray<Readonly<Assessment>>) {}

    public generateInitialState(persistedData: AssessmentStoreData = null): AssessmentStoreData {
        const targetTab: PersistedTabInfo = persistedData &&
            persistedData.persistedTabInfo && {
                id: persistedData?.persistedTabInfo?.id,
                url: persistedData?.persistedTabInfo?.url,
                title: persistedData?.persistedTabInfo?.title,
                detailsViewId: persistedData?.persistedTabInfo?.detailsViewId,
            };
        let persistedTests = persistedData && persistedData.assessments;
        if (persistedTests) {
            persistedTests = { ...persistedTests };
            // keep the keys but discard any stored data
            deprecatedAssessmentKeys.forEach(key => {
                if (key in persistedTests) {
                    persistedTests[key] = null;
                }
            });
        }
        // defaulting this.tests values to null instead of doing multiple if
        const first = head(this.tests) || this.NULL_FIRST_TEST;
        let selectedTestType =
            persistedData?.assessmentNavState?.selectedTestType ?? first.visualizationType;
        let selectedTestStep =
            persistedData?.assessmentNavState?.selectedTestSubview ??
            (first.requirements && first.requirements[0] && first.requirements[0].key);

        // If the persisted nav points at a deprecated assessment, fall back to defaults
        if (deprecatedVisualizationTypes.includes(selectedTestType as VisualizationType)) {
            selectedTestType = first.visualizationType;
            selectedTestStep = first.requirements?.[0]?.key;
        }

        const expandedTestType = persistedData?.assessmentNavState?.expandedTestType;
        const resultDescription = (persistedData && persistedData.resultDescription) || '';

        const state: Partial<AssessmentStoreData> = {
            persistedTabInfo: targetTab,
            assessmentNavState: {
                selectedTestType: selectedTestType,
                selectedTestSubview: selectedTestStep,
                expandedTestType: expandedTestType,
            },
            assessments: this.constructInitialDataForAssessment(persistedTests),
            resultDescription: resultDescription,
        };

        return state as AssessmentStoreData;
    }

    private constructInitialDataForAssessment(
        persistedTests: DictionaryStringTo<AssessmentData> = null,
    ): DictionaryStringTo<AssessmentData> {
        const assessmentData: DictionaryStringTo<AssessmentData> = {};

        this.tests.forEach(test => {
            const persistedTestData = persistedTests && persistedTests[test.key];
            assessmentData[test.key] = test.initialDataCreator(test, persistedTestData);
        });

        // add placeholder objects for every deprecated assessment key
        deprecatedAssessmentKeys.forEach(key => {
            if (!(key in assessmentData)) {
                assessmentData[key] = {
                    enabled: false,
                    stepStatus: {},
                } as unknown as AssessmentData;
            }
        });

        return assessmentData;
    }
}
