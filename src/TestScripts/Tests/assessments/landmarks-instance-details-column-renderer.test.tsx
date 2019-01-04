// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    landmarksAssessmentInstanceDetailsColumnRenderer,
} from '../../../assessments/landmarks/landmarks-instance-details-column-renderer';
import { ILandmarksAssessmentProperties } from '../../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../DetailsView/components/assessment-instance-details-column';
import { IAssessmentInstanceRowData } from '../../../DetailsView/components/assessment-instance-table';
import { LandmarkFormatter } from '../../../injected/visualization/landmark-formatter';

describe('LandmarksInstanceDetailsColumnRendererTest', () => {
    test('render', () => {
        const item = {
            instance: {
                propertyBag: {
                    role: 'banner',
                    label: 'label',
                },
            },
        } as IAssessmentInstanceRowData<ILandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.landmarkStyles.banner.borderColor}
                textContent={'banner: label'}
                tooltipId={null}
                customClassName="radio"
            />
        );
        expect(expected).toEqual(landmarksAssessmentInstanceDetailsColumnRenderer(item));
    });

    test('render: label is null', () => {
        const item = {
            instance: {
                propertyBag: {
                    role: 'banner',
                    label: null,
                },
            },
        } as IAssessmentInstanceRowData<ILandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.landmarkStyles.banner.borderColor}
                textContent={'banner'}
                tooltipId={null}
                customClassName="radio"
            />
        );
        expect(expected).toEqual(landmarksAssessmentInstanceDetailsColumnRenderer(item));
    });
});
