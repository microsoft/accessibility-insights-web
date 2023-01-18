// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isAnAssessmentSelected } from 'background/is-an-assessment-selected';
import { TestsEnabledState } from '../../../../common/types/store-data/visualization-store-data';

describe('isAnAssessmentSelectedTest', () => {
    it('exists', () => {
        expect(isAnAssessmentSelected).toBeDefined();
    });

    it('returns false when a test is selected', () => {
        const testData: TestsEnabledState = {
            adhoc: {
                'some-test': {
                    enabled: true,
                },
            },
            assessments: {},
            quickAssess: {},
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeFalsy();
    });

    it('returns false when all assessments are not selected', () => {
        const testData: TestsEnabledState = {
            adhoc: {},
            assessments: {
                'some-test-2': {
                    enabled: false,
                    stepStatus: {},
                },
            },
            quickAssess: {},
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeFalsy();
    });

    it('returns true when an assessment is selected', () => {
        const testStub = 'some test';
        const testData: TestsEnabledState = {
            adhoc: {},
            assessments: {
                [testStub]: {
                    enabled: true,
                    stepStatus: {},
                },
            },
            quickAssess: {},
        };

        const actual = isAnAssessmentSelected(testData);
        expect(actual).toBeTruthy();
    });
});
