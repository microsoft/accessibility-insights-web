// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getReportForAssessment,
    getReportForFastPass,
    SaveAssessmentFactoryProps,
} from 'DetailsView/components/save-assessment-factory';

describe('SaveAssessmentFactory', () => {
    let props: SaveAssessmentFactoryProps;

    describe('getReportForAssessment', () => {
        test('renders save assessment button', () => {
            const rendered = getReportForAssessment(props);
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('getReportForFastPass', () => {
        test('renders save assessment button as null', () => {
            const rendered = getReportForFastPass(props);
            expect(rendered).toBeNull();
        });
    });
});
