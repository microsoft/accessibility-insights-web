// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/errors/error-suggestion';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ErrorsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If an input error is automatically detected, guidance for correcting the error must be
        provided.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any input fields with automatic error detection,
                such as:
                <ol>
                    <li>Required fields</li>
                    <li>Fields with required formats (e.g., date)</li>
                    <li>Passwords</li>
                    <li>Zip code fields</li>
                </ol>
            </li>
            <li>
                If you find such an input field, enter an incorrect value that triggers automatic
                error detection.
            </li>
            <li>
                Examine the error notification to verify that guidance for correcting the error is
                provided to the user (unless it would jeopardize the security or purpose of the
                content).
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ErrorSuggestion: Requirement = {
    key: ErrorsTestStep.errorSuggestion,
    name: 'Error suggestion',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_3_3],
};
