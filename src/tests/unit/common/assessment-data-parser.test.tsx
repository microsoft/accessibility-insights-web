// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDataParser } from 'common/assessment-data-parser';

describe('AssessmentDataParser', () => {
    it('returns the parsed assessment data string as an object of type versionedAssessmentData', () => {
        const testDataParser = new AssessmentDataParser();
        const testAssessmentData = `{
            "version":1,
            "assessmentData":"data"
        }`;
        const parsedAssessmentData = testDataParser.parseAssessmentData(testAssessmentData);
        expect(parsedAssessmentData).toMatchSnapshot();
    });
});
