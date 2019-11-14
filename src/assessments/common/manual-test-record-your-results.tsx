// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import * as Markup from '../markup';

export interface ManualTestRecordYourResultsProps {
    isMultipleFailurePossible: boolean;
}

export const ManualTestRecordYourResults = (
    props: ManualTestRecordYourResultsProps,
) => (
    <li>
        Record your results:
        <ol>
            <li>
                If you find{' '}
                {props.isMultipleFailurePossible ? 'any failures' : 'a failure'}
                , select <Markup.Term>Fail</Markup.Term>,
                {props.isMultipleFailurePossible
                    ? ' then add them as failure instances'
                    : ' then add the failure instance'}
                .
            </li>
            <li>
                Otherwise, select <Markup.Term>Pass</Markup.Term>.
            </li>
        </ol>
    </li>
);
