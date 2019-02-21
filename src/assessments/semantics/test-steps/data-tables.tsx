// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { SemanticsTestStep } from './test-steps';

const dataTablesDescription: JSX.Element = <span>Semantic elements in a data table must not be coded as decorative.</span>;

const dataTablesHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>datatables how to test</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const DataTables: TestStep = {
    key: SemanticsTestStep.dataTables,
    name: 'Data tables',
    description: dataTablesDescription,
    howToTest: dataTablesHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
