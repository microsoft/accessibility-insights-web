// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { SemanticsTestStep } from './test-steps';

const letterSpacingDescription: JSX.Element = (
    <span>Words and phrases that are visually emphasized must be contained within semantically correct containers.</span>
);

const letterSpacingHowToTest: JSX.Element = (
    <div>
        <p>This procedure uses the Chrome Developer Tools (F12) to inspect the page's HTML.</p>
        <ol>
            <li>Examine the target page to identify any words that appear to have increased spacing between letters.</li>
            <li>
                Inspect the HTML for each word with increased spacing to verify that it does not include any spacing characters. Spacing
                characters include spaces, tabs, line breaks, and carriage returns.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const SemanticsLetterSpacing: TestStep = {
    key: SemanticsTestStep.letterSpacing,
    name: 'Letter spacing',
    description: letterSpacingDescription,
    howToTest: letterSpacingHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
