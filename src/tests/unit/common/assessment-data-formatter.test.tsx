// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
} from 'common/types/store-data/assessment-result-data';

describe('AssessmentDataFormatter', () => {
    it('returns the formatted assessment data object as a string', () => {
        const testDataFormatter = new AssessmentDataFormatter();
        const testAssessmentData = {
            assessments: {
                ['assessment-1']: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                    manualTestStepResultMap: {
                        ['assessment-1-step-1']: {
                            instances: [],
                            status: 2,
                            id: 'assessment-1-step-1',
                        },
                        ['removed-step']: {
                            instances: [],
                            status: 2,
                            id: '123',
                        },
                    },
                    testStepStatus: {},
                },
            } as { [key: string]: AssessmentData },
            persistedTabInfo: { title: 'SavedAssessment123' },
        } as AssessmentStoreData;
        const formattedAssessmentData = testDataFormatter.formatAssessmentData(testAssessmentData);
        expect(formattedAssessmentData).toMatchSnapshot();
    });

    it('removed cycles in designPatterns', () => {
        const testDataFormatter = new AssessmentDataFormatter();
        const instances = [];
        const testAssessmentData = {
            assessments: {
                ['assessment-1']: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                    manualTestStepResultMap: {
                        ['assessment-1-step-1']: {
                            instances,
                            status: 2,
                            id: 'assessment-1-step-1',
                        },
                        ['removed-step']: {
                            instances,
                            status: 2,
                            id: '123',
                        },
                    },
                    testStepStatus: {},
                },
            } as { [key: string]: AssessmentData },
            persistedTabInfo: { title: 'SavedAssessment123' },
        } as AssessmentStoreData;

        // Introduce a cycle
        testAssessmentData.assessments.generatedAssessmentInstancesMap = {
            fullAxeResultsMap: {},
            generatedAssessmentInstancesMap: {
                id: {
                    target: [],
                    html: '',
                    testStepResults: {},
                    propertyBag: {
                        designPattern: [{ _owner: testAssessmentData.assessments }],
                    },
                } as GeneratedAssessmentInstance,
            },
            testStepStatus: {},
        };

        const formattedAssessmentData = testDataFormatter.formatAssessmentData(testAssessmentData);
        expect(formattedAssessmentData).toMatchSnapshot();
    });
});
