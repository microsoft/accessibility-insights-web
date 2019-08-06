// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from 'DetailsView/components/assessment-instance-table';
import * as React from 'react';

export function pageTitleInstanceDetailsColumnRenderer(item: AssessmentInstanceRowData<any>): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const textContent = propertyBag ? propertyBag.pageTitle : null;

    return <AssessmentInstanceDetailsColumn background={null} textContent={textContent} tooltipId={null} />;
}
