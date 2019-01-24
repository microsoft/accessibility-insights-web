// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IAssessmentInstanceRowData } from '../../DetailsView/components/assessment-instance-table';
import { AssessmentInstanceDetailsColumn } from '../../DetailsView/components/assessment-instance-details-column';

export function pageTitleInstanceDetailsColumnRenderer(item: IAssessmentInstanceRowData<any>): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const textContent = propertyBag ? propertyBag.pageTitle : null;

    return <AssessmentInstanceDetailsColumn background={null} textContent={textContent} tooltipId={null} />;
}
