// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/errors/error-identification';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ErrorsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If an input error is automatically detected, the item in error must be identified, and the
        error described, in text.
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
                Verify that:
                <ol>
                    <li>The field with the error is identified in text, and</li>
                    <li>The error is described in text.</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ErrorIdentification: Requirement = {
    key: ErrorsTestStep.errorIdentification,
    name: 'Error identification',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_3_1],
};
