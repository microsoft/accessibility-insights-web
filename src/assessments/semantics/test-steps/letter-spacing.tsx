// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/semantics/letter-spacing';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const letterSpacingDescription: JSX.Element = (
    <span>
        Spacing characters must not be used to increase the space between
        letters in a word.
    </span>
);

const letterSpacingHowToTest: JSX.Element = (
    <div>
        <p>
            This procedure uses the browser Developer Tools (F12) to inspect the
            page's HTML.
        </p>
        <ol>
            <li>
                Examine the target page to identify any words that appear to
                have increased spacing between letters.
            </li>
            <li>
                Inspect the HTML for each word with increased spacing to verify
                that it does not include any spacing characters. Spacing
                characters include spaces, tabs, line breaks, and carriage
                returns.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const SemanticsLetterSpacing: Requirement = {
    key: SemanticsTestStep.letterSpacing,
    name: 'Letter spacing',
    description: letterSpacingDescription,
    howToTest: letterSpacingHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
};
