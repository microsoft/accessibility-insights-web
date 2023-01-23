// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import {
    getAssessmentStoreData,
    getQuickAssessStoreData,
    GetSelectedAssessmentStoreDataProps,
} from 'DetailsView/components/left-nav/get-selected-assessment-store-data';

describe('GetSelectedAssessmentStoreData', () => {
    let props: GetSelectedAssessmentStoreDataProps;

    beforeEach(() => {
        props = {
            quickAssessStoreData: {
                assessmentNavState: {
                    selectedTestType: VisualizationType.HeadingsQuickAssess,
                },
            },
            assessmentStoreData: {
                assessmentNavState: {
                    selectedTestType: VisualizationType.Headings,
                },
            },
        } as GetSelectedAssessmentStoreDataProps;
    });

    test('assessment', () => {
        expect(getAssessmentStoreData(props)).toEqual(props.assessmentStoreData);
    });

    test('quickAssess', () => {
        expect(getQuickAssessStoreData(props)).toEqual(props.quickAssessStoreData);
    });
});
