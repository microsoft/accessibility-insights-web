// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LoadAssessmentButtonProps } from 'DetailsView/components/load-assessment-button';
import {
    getLoadButtonForAssessment,
    getNullLoadButton,
} from 'DetailsView/components/load-assessment-button-factory';

describe('LoadAssessmentFactory', () => {
    let props: LoadAssessmentButtonProps;

    describe('getLoadButtonForAssessment', () => {
        test('renders load assessment button', () => {
            const rendered = getLoadButtonForAssessment(props);
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('getLoadButtonForFastPass', () => {
        test('renders load assessment button as null', () => {
            const rendered = getNullLoadButton(props);
            expect(rendered).toBeNull();
        });
    });
});
