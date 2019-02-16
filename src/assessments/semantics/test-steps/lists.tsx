// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { SemanticsTestStep } from './test-steps';

const listsDescription: JSX.Element = (
    <span>Semantic elements in a data table must not be coded as decorative.</span>
);

const listsHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                lists how to test
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Lists: TestStep = {
    key: SemanticsTestStep.lists,
    name: 'Data tables',
    description: listsDescription,
    howToTest: listsHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
