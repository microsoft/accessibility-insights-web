// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataFormatter } from 'common/assessment-data-formatter';

describe('AssessmentDataFormatter', () => {
    it('returns the formatted assessment data object as a string', () => {
        const testDataFormatter = new AssessmentDataFormatter()
        const testAssessmentData = {
            'mock': 'data'
            };
        const formattedAssessmentData = testDataFormatter.formatAssessmentData(testAssessmentData);
        expect(formattedAssessmentData).toMatchSnapshot();
    })
});
