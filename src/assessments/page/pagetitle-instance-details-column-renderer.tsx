// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PageAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import * as React from 'react';

export function pageTitleInstanceDetailsColumnRenderer(
    item: InstanceTableRow<PageAssessmentProperties>,
): JSX.Element {
    const propertyBag = item.instance.propertyBag;
    // Undefined pageTitles shouldn't occur in practice; the browser will infer the title to be
    // the last URL path component rather than emitting an undefined page title
    const textContent = propertyBag?.pageTitle ?? '';

    return <AssessmentInstanceDetailsColumn textContent={textContent} />;
}
