// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { landmarksAssessmentInstanceDetailsColumnRenderer } from 'assessments/landmarks/landmarks-instance-details-column-renderer';
import { LandmarksAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { LandmarkFormatter } from '../../../../injected/visualization/landmark-formatter';
import { AssessmentInstanceRowData } from 'assessments/types/instance-table-column';

describe('LandmarksInstanceDetailsColumnRendererTest', () => {
    test('render', () => {
        const item = {
            instance: {
                propertyBag: {
                    role: 'banner',
                    label: 'label',
                },
            },
        } as AssessmentInstanceRowData<LandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.getStyleForLandmarkRole('banner').borderColor}
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
        } as AssessmentInstanceRowData<LandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.getStyleForLandmarkRole('banner').borderColor}
                textContent={'banner'}
                tooltipId={null}
                customClassName="radio"
            />
        );
        expect(expected).toEqual(landmarksAssessmentInstanceDetailsColumnRenderer(item));
    });
});
