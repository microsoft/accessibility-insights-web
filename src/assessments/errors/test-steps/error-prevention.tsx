// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/errors/error-prevention';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { ErrorsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If submitting data might have serious consequences, users must be able to correct the data
        input before finalizing a submission.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether it allows users to:
                <ol>
                    <li>Make any legal commitments or financial transactions, or</li>
                    <li>Modify or delete data in a data storage system, or</li>
                    <li>Submit test responses.</li>
                </ol>
            </li>
            <li>
                If the page <Markup.Emphasis>does</Markup.Emphasis> allow such actions, verify that
                at least one of the following is true:
                <ol>
                    <li>Submissions are reversible.</li>
                    <li>
                        Data entered by the user is checked for input errors, and the user is given
                        an opportunity to correct them.
                    </li>
                    <li>
                        The user can review, confirm, and correct information before finalizing the
                        submission.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={false} />
        </ol>
    </div>
);

export const ErrorPrevention: Requirement = {
    key: ErrorsTestStep.errorPrevention,
    name: 'Error prevention',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_3_4],
};
