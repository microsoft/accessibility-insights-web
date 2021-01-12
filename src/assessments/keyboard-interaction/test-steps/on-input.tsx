// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/keyboard/on-input';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Changing a component's settings must not trigger any unexpected change of context.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Use standard keyboard commands to navigate through all the interactive interface
                components in the target page.
                <ol>
                    <li>
                        Enter data in each text field and then <Markup.Term>Tab</Markup.Term> away
                        from the field.
                    </li>
                    <li>
                        Change selections for selectable components such as toggle buttons, radio
                        buttons, check boxes, and list boxes.
                    </li>
                </ol>
            </li>
            <li>
                Verify that changing the component's settings does not trigger any unexpected change
                in context, such as:
                <ol>
                    <li>Submitting a form automatically</li>
                    <li>Launching a new window</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const OnInput: Requirement = {
    key: KeyboardInteractionTestStep.onInput,
    name: 'On input',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_2_2],
};
