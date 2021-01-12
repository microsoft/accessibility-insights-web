// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/keyboard/no-keystroke-timings';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Components must not require specific timings for individual keystrokes.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>Use the keyboard to perform all functions that are available using a mouse.</li>
            <li>
                Verify that individual keystrokes do not require specific timings, such as requiring
                users to:
                <ol>
                    <li>Repeatedly press a key within a short period of time</li>
                    <li>Enter a series of keystrokes within a short period of time</li>
                    <li>Press and hold a key for an extended period of time</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoKeystrokeTiming: Requirement = {
    key: KeyboardInteractionTestStep.noKeystrokeTiming,
    name: 'No keystroke timings',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_1_1],
};
