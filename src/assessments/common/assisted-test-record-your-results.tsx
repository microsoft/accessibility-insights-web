// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import * as Markup from '../markup';

export const AssistedTestRecordYourResults = () => (
    <li>
        Record your results:
        <ol>
            <li>
                Select <Markup.Term>Fail</Markup.Term> for any instances that do
                not meet the requirement.
            </li>
            <li>
                Otherwise, select <Markup.Term>Pass</Markup.Term>. Or, after you
                have marked all failures, select{' '}
                <Markup.Term>Pass unmarked instances.</Markup.Term>
            </li>
        </ol>
    </li>
);
