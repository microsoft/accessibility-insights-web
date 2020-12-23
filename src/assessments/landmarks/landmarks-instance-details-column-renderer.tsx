// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { LandmarksAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { LandmarkFormatter } from 'injected/visualization/landmark-formatter';
import { InstanceTableRow } from 'assessments/types/instance-table-data';

export function landmarksAssessmentInstanceDetailsColumnRenderer(
    item: InstanceTableRow<LandmarksAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const background = LandmarkFormatter.getStyleForLandmarkRole(propertyBag.role).borderColor;
    let textContent = propertyBag.role;
    if (propertyBag.label != null) {
        textContent += `: ${propertyBag.label}`;
    }

    return (
        <AssessmentInstanceDetailsColumn
            background={background}
            textContent={textContent}
            tooltipId={null}
            customClassName="radio"
        />
    );
}
