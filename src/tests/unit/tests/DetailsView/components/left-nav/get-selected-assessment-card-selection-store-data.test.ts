// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    getAssessmentCardSelectionStoreData,
    getQuickAssessCardSelectionStoreData,
    GetSelectedAssessmentCardSelectionStoreDataProps,
} from 'DetailsView/components/left-nav/get-selected-assessment-card-selection-store-data';

describe('GetSelectedAssessmentCardSelectionCardSelectionStoreData', () => {
    let props: GetSelectedAssessmentCardSelectionStoreDataProps;

    beforeEach(() => {
        props = {
            quickAssessCardSelectionStoreData: {
                'quick-assess-test-key': {} as CardSelectionStoreData,
            },
            assessmentCardSelectionStoreData: {
                'assessment-test-key': {} as CardSelectionStoreData,
            },
        } as GetSelectedAssessmentCardSelectionStoreDataProps;
    });

    test('assessment', () => {
        expect(getAssessmentCardSelectionStoreData(props)).toEqual(
            props.assessmentCardSelectionStoreData,
        );
    });

    test('quickAssess', () => {
        expect(getQuickAssessCardSelectionStoreData(props)).toEqual(
            props.quickAssessCardSelectionStoreData,
        );
    });
});
