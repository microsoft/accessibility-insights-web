// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/keyboard/character-key-shortcuts';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Users must be able to turn off or remap character key shortcuts.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any keyboard shortcuts that can be activated
                using only printable keys, such as letters, numbers, symbols, or punctuation. (Alt,
                Shift, and Ctrl are non-printable keys.)
            </li>
            <li>
                Verify that at least one of the following is true:
                <ol>
                    <li>A mechanism is available to turn off the shortcut.</li>
                    <li>
                        A mechanism is available to remap the shortcut to use one or more
                        non-printable keyboard characters.
                    </li>
                </ol>
                Exception: This requirement does not apply to a keyboard shortcut for a user
                interface component if the shortcut is active only when that component has focus.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const CharacterKeyShortcuts: Requirement = {
    key: KeyboardInteractionTestStep.characterKeyShortcuts,
    name: 'Character key shortcuts',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_1_4],
};
