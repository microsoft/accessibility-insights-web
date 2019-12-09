// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from 'DetailsView/components/assessment-instance-table';
import { FrameFormatter } from 'injected/visualization/frame-formatter';
import * as React from 'react';

export function frameTitleInstanceDetailsColumnRenderer(
    item: AssessmentInstanceRowData<FrameAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const frameTitle = propertyBag ? propertyBag.frameTitle : null;
    const frameType = propertyBag ? propertyBag.frameType : 'default';
    const frameConfig = FrameFormatter.frameStyles[frameType];

    return (
        <AssessmentInstanceDetailsColumn
            background={frameConfig.borderColor}
            labelText={frameConfig.contentText}
            textContent={frameTitle}
            tooltipId={null}
        />
    );
}
