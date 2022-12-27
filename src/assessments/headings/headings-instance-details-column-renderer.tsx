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
    const textContent = propertyBag?.headingText ?? '';
    const headingLevel = propertyBag?.headingLevel ?? null;

    const labelText = headingLevel != null ? `H${headingLevel}` : 'N/A';
    const headingStyle = headingLevel != null ? HeadingFormatter.headingStyles[headingLevel] : null;
    const customClass = headingLevel != null ? undefined : 'not-applicable';
    const background = headingStyle != null ? headingStyle.outlineColor : '#767676';

    return (
        <AssessmentInstanceDetailsColumn
            background={background}
            labelText={labelText}
            textContent={textContent}
            customClassName={customClass}
        />
    );
}
