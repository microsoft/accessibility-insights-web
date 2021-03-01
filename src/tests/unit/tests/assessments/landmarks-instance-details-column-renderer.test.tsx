// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { landmarksAssessmentInstanceDetailsColumnRenderer } from 'assessments/landmarks/landmarks-instance-details-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import * as React from 'react';
import { LandmarksAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { LandmarkFormatter } from '../../../../injected/visualization/landmark-formatter';

describe('LandmarksInstanceDetailsColumnRendererTest', () => {
    test('render', () => {
        const item = {
            instance: {
                propertyBag: {
                    role: 'banner',
                    label: 'label',
                },
            },
        } as InstanceTableRow<LandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.getStyleForLandmarkRole('banner').borderColor}
                textContent={'banner: label'}
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
        } as InstanceTableRow<LandmarksAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={LandmarkFormatter.getStyleForLandmarkRole('banner').borderColor}
                textContent={'banner'}
                customClassName="radio"
            />
        );
        expect(expected).toEqual(landmarksAssessmentInstanceDetailsColumnRenderer(item));
    });
});
