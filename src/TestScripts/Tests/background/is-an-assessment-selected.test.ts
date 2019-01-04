// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isAnAssessmentSelected } from '../../../background/is-an-assessment-selected';
import { ITestsEnabledState } from '../../../common/types/store-data/ivisualization-store-data';

describe('isAnAssessmentSelectedTest', () => {
    it('exists', () => {
        expect(isAnAssessmentSelected).toBeDefined();
    });

    it('returns false when a test is selected', () =>{
        const testData: ITestsEnabledState = {
            adhoc: {
                'some-test': {
                    enabled: true,
                },
            },
            assessments: {

            },
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeFalsy();
    });

    it('returns false when all assessments are not selected', () =>{
        const testData: ITestsEnabledState = {
            adhoc: {
            },
            assessments: {
                'some-test-2': {
                    enabled: false,
                    stepStatus: {},
                },
            },
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeFalsy();
    });

    it('returns true when an assessment is selected', () => {
        const testStub = 'some test';
        const testData: ITestsEnabledState = {
            adhoc: {
            },
            assessments: {
                [testStub]: {
                    enabled: true,
                    stepStatus: {},
                },
            },
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeTruthy();
    });
});
