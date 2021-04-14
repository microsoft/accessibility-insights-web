// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import * as React from 'react';

export function pageTitleInstanceDetailsColumnRenderer(item: InstanceTableRow<any>): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    const textContent = propertyBag ? propertyBag.pageTitle : null;

    return <AssessmentInstanceDetailsColumn textContent={textContent} />;
}
