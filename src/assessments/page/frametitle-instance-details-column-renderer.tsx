// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IFrameAssessmentProperties } from '../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../DetailsView/components/assessment-instance-details-column';
import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { FrameFormatter } from '../../injected/visualization/frame-formatter';

export function frameTitleInstanceDetailsColumnRenderer(item: IAssessmentInstanceRowData<IFrameAssessmentProperties>): JSX.Element {
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
