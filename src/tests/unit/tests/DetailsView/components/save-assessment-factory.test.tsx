// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getSaveButtonForAssessment,
    getSaveButtonForFastPass,
    SaveAssessmentFactoryProps,
} from 'DetailsView/components/save-assessment-factory';

describe('SaveAssessmentFactory', () => {
    let props: SaveAssessmentFactoryProps;

    describe('getSaveButtonForAssessment', () => {
        test('renders save assessment button', () => {
            const rendered = getSaveButtonForAssessment(props);
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('getSaveButtonForFastPass', () => {
        test('renders save assessment button as null', () => {
            const rendered = getSaveButtonForFastPass(props);
            expect(rendered).toBeNull();
        });
    });
});
