// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { HeadingsAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { HeadingFormatter } from 'injected/visualization/heading-formatter';
import * as React from 'react';

export function headingsAssessmentInstanceDetailsColumnRenderer(
    item: InstanceTableRow<HeadingsAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const textContent = propertyBag ? propertyBag.headingText : null;
    const headingLevel = propertyBag ? propertyBag.headingLevel : null;
    const labelText = headingLevel ? `H${item.instance.propertyBag.headingLevel}` : 'N/A';
    const headingStyle = headingLevel ? HeadingFormatter.headingStyles[headingLevel] : null;
    const background = headingStyle ? headingStyle.borderColor : '#767676';
    let customClass: string = null;

    if (headingLevel == null) {
        customClass = 'not-applicable';
    }

    return (
        <AssessmentInstanceDetailsColumn
            background={background}
            labelText={labelText}
            textContent={textContent}
            customClassName={customClass}
        />
    );
}
