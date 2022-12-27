// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { FrameAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { FrameFormatter } from 'injected/visualization/frame-formatter';
import * as React from 'react';

export function frameTitleInstanceDetailsColumnRenderer(
    item: InstanceTableRow<FrameAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    // Undefined frameTitles shouldn't occur; frames without titles are expected to be omitted from
    // the instance list, since they're already covered by an automated check failure.
    const frameTitle = propertyBag?.frameTitle ?? '';
    const frameType = propertyBag ? propertyBag.frameType : 'default';
    const frameConfig = FrameFormatter.frameStyles[frameType];

    return (
        <AssessmentInstanceDetailsColumn
            background={frameConfig.outlineColor}
            labelText={frameConfig.contentText}
            textContent={frameTitle}
        />
    );
}
