// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/keyboard/on-focus';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Navigating to a component must not trigger any unexpected change of context.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Use standard keyboard commands to navigate through all the interactive interface
                components in the target page.
            </li>
            <li>
                Verify that moving focus to a component does not trigger any{' '}
                <Markup.Emphasis>unexpected</Markup.Emphasis> change of context, such as:
                <ol>
                    <li>Submitting a form automatically</li>
                    <li>Launching a new window</li>
                    <li>Shifting focus automatically to another component</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const OnFocus: Requirement = {
    key: KeyboardInteractionTestStep.onFocus,
    name: 'On focus',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_2_1],
};
