// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import {
    getAssessmentSelectedDetailsView,
    GetAssessmentSelectedDetailsViewProps,
    getFastPassSelectedDetailsView,
    GetFastPassSelectedDetailsViewProps,
    getQuickAssessSelectedDetailsView,
    GetQuickAssessSelectedDetailsViewProps,
} from 'DetailsView/components/left-nav/get-selected-details-view';

describe('getAssessmentSelectedDetailsView', () => {
    it('should return selected test type from store data', () => {
        const expectedValue = -1 as VisualizationType;
        const props = {
            assessmentStoreData: {
                assessmentNavState: {
                    selectedTestType: expectedValue,
                },
            },
        } as GetAssessmentSelectedDetailsViewProps;

        expect(getAssessmentSelectedDetailsView(props)).toEqual(expectedValue);
    });
});

describe('getFastPassSelectedDetailsView', () => {
    it('should return selected fast pass details view', () => {
        const expectedValue = -1 as VisualizationType;
        const props = {
            visualizationStoreData: {
                selectedFastPassDetailsView: expectedValue,
            },
        } as GetFastPassSelectedDetailsViewProps;

        expect(getFastPassSelectedDetailsView(props)).toEqual(expectedValue);
    });
});

describe('getQuickAssessSelectedDetailsView', () => {
    it('should return selected fast pass details view', () => {
        const expectedValue = -1 as VisualizationType;
        const props = {
            quickAssessStoreData: {
                assessmentNavState: {
                    selectedTestType: expectedValue,
                },
            },
        } as GetQuickAssessSelectedDetailsViewProps;

        expect(getQuickAssessSelectedDetailsView(props)).toEqual(expectedValue);
    });
});
