// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/keyboard/no-keyboard-traps';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Users must be able to <Markup.Emphasis>navigate away</Markup.Emphasis> from all components using a keyboard.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Use standard keyboard commands (unmodified Tab and arrow keys) to navigate through all the interactive interface components
                in the target page.
            </li>
            <li>
                If you can't navigate away from a component using standard keyboard commands:
                <ol>
                    <li>
                        Examine the component's accessible name and accessible description to determine whether they describe an alternative
                        keyboard command.
                    </li>
                    <li>If an alternative keyboard command is documented, test whether it works.</li>
                </ol>
            </li>
            <li>
                Verify that you can navigate away from all components using <Markup.Emphasis>either</Markup.Emphasis>
                <ol>
                    <li>Standard keyboard commands, or</li>
                    <li>An alternative keyboard command that's described to users.</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoKeyboardTraps: Requirement = {
    key: KeyboardInteractionTestStep.noKeyBoardTraps,
    name: 'No keyboard traps',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_1_2],
};
