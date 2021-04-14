// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import * as React from 'react';

export function onRenderPathColumn(item: InstanceTableRow): JSX.Element {
    let textContent = '';
    if (item.instance.target) {
        textContent = item.instance.target.join(';');
    }

    return (
        <AssessmentInstanceDetailsColumn
            textContent={textContent}
            customClassName="not-applicable"
        />
    );
}

export function onRenderSnippetColumn(item: InstanceTableRow): JSX.Element {
    return (
        <AssessmentInstanceDetailsColumn
            textContent={item.instance.html}
            customClassName="not-applicable"
        />
    );
}
