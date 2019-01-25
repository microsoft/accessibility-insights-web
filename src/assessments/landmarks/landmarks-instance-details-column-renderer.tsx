// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ILandmarksAssessmentProperties } from '../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../DetailsView/components/assessment-instance-details-column';
import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { LandmarkFormatter } from '../../injected/visualization/landmark-formatter';

export function landmarksAssessmentInstanceDetailsColumnRenderer(
    item: IAssessmentInstanceRowData<ILandmarksAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const background = LandmarkFormatter.landmarkStyles[propertyBag.role].borderColor;
    let textContent = propertyBag.role;
    if (propertyBag.label != null) {
        textContent += `: ${propertyBag.label}`;
    }

    return <AssessmentInstanceDetailsColumn background={background} textContent={textContent} tooltipId={null} customClassName="radio" />;
}
