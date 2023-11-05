// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/cognitive/redundant-entry';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { CognitiveTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Do not require people to re-enter information they have already provided via other means -
        e.g., as part of a previous step in the same form.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify user input mechanisms that request information
                to be entered (for example form fields, passwords, etc.)
            </li>
            <li>
                Verify if the information has already been requested on a previous step of the
                process and that the information entered previously is prepopulated in the fields or
                displayed on the page. If either of these conditions fail, the test is considered a
                failure.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const RedundantEntry: Requirement = {
    key: CognitiveTestStep.redundantEntry,
    name: 'Redundant Entry',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_3_7],
};
