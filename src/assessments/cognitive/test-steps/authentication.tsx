// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/cognitive/authentication';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { CognitiveTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        People with cognitive issues relating to memory, reading (for example, dyslexia), numbers
        (for example, dyscalculia), or perception-processing limitations will be able to
        authenticate irrespective of the level of their cognitive abilities.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            Note: Text-based personal content does not qualify for an exception as it relies on
            recall (rather than recognition), and transcription (rather than selecting an item).
        </p>
        <ol>
            <li>
                Examine the target page to identify the input fields and verify whether they prevent
                the user from pasting or auto-filling the entire password or code in the format in
                which it was originally created.
            </li>
            <li>
                Confirm whether any other acceptable authentication methods are present that satisfy
                the criteria such as an authentication method that does not rely on a cognitive
                function test.
            </li>
            <li>If either of these above conditions fail, the test is considered a failure.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Authentication: Requirement = {
    key: CognitiveTestStep.authentication,
    name: 'Authentication',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_3_8],
};
