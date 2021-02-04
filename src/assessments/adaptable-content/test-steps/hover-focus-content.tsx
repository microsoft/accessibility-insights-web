// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/hover-focus-content';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';

const hoverFocusContentDescription: JSX.Element = (
    <span>
        Content that appears on focus or hover must be dismissible, hoverable, and persistent.
    </span>
);

const hoverFocusContentHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any components that reveal additional content
                when they receive focus or pointer hover, such as a button that shows a tooltip on
                hover.
            </li>
            <li>
                Verify that all of the following are true:
                <ol>
                    <li>
                        <Markup.Term>Dismissible.</Markup.Term> A mechanism is available to dismiss
                        the additional content without moving pointer hover or keyboard focus,
                        unless the additional content communicates an input error or does not
                        obscure or replace other content.
                    </li>
                    <li>
                        <Markup.Term>Hoverable.</Markup.Term> If pointer hover can trigger the
                        additional content, then the pointer can be moved over the additional
                        content without the additional content disappearing.
                    </li>
                    <li>
                        <Markup.Term>Persistent.</Markup.Term> The additional content remains
                        visible until the hover or focus trigger is removed, the user dismisses it,
                        or its information is no longer valid.
                    </li>
                </ol>
                Exception: This requirement does not apply if the visual presentation of the
                additional content is controlled solely by the browser.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const HoverFocusContent: Requirement = {
    key: AdaptableContentTestStep.hoverFocusContent,
    name: 'Hover / focus content',
    description: hoverFocusContentDescription,
    howToTest: hoverFocusContentHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_4_13],
};
