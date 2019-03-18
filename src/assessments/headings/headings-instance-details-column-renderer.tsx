// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IHeadingsAssessmentProperties } from '../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { HeadingFormatter } from '../../injected/visualization/heading-formatter';

export function headingsAssessmentInstanceDetailsColumnRenderer(
    item: AssessmentInstanceRowData<IHeadingsAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const textContent = propertyBag ? propertyBag.headingText : null;
    const headingLevel = propertyBag ? propertyBag.headingLevel : null;
    const labelText = headingLevel ? `H${item.instance.propertyBag.headingLevel}` : 'N/A';
    const background = headingLevel ? HeadingFormatter.headingStyles[headingLevel].borderColor : '#767676';
    let customClass: string = null;

    if (headingLevel == null) {
        customClass = 'not-applicable';
    }

    return (
        <AssessmentInstanceDetailsColumn
            background={background}
            labelText={labelText}
            textContent={textContent}
            tooltipId={null}
            customClassName={customClass}
        />
    );
}
