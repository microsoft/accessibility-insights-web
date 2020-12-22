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
            background={null}
            labelText={null}
            textContent={textContent}
            tooltipId={null}
            customClassName="not-applicable"
        />
    );
}

export function onRenderSnippetColumn(item: InstanceTableRow): JSX.Element {
    return (
        <AssessmentInstanceDetailsColumn
            background={null}
            labelText={null}
            textContent={item.instance.html}
            tooltipId={null}
            customClassName="not-applicable"
        />
    );
}
