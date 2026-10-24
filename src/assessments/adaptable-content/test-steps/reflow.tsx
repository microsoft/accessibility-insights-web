// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import * as Markup from 'assessments/markup';
import { Requirement } from 'assessments/types/requirement';
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/reflow';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';

const reflowDescription: JSX.Element = (
    <span>Content must be visible without having to scroll in two dimensions.</span>
);

const reflowHowToTest: JSX.Element = (
    <div>
        The following steps assume the page uses a script that is read horizontally (left-to-right
        or right-to-left) rather than vertically (top-to-bottom).
        <ol>
            <li>
                Use browser zoom so that the target page's CSS viewport is{' '}
                <Markup.Emphasis>320 CSS pixels wide</Markup.Emphasis>. One way to do this on a 1280
                x 1024 display is 400% zoom in full-screen mode (1280 / 4 = 320).
                <ul>
                    <li>
                        WCAG 1.4.10 Reflow requires content to remain available without scrolling in
                        two dimensions at 320 CSS pixels wide (for vertical scrolling content) or
                        256 CSS pixels high (for horizontal scrolling content). It does not require
                        every UI chrome element to be redesigned for a 320 x 256 device layout.
                    </li>
                    <li>
                        If content scrolls horizontally, also check at a height equivalent to 256
                        CSS pixels.
                    </li>
                </ul>
            </li>
            <li>
                Examine the target page to verify that all{' '}
                <Markup.Emphasis>text content</Markup.Emphasis> is available without horizontal
                scrolling. Content can be displayed directly in the page, revealed via accessible
                controls, or accessed via direct links.
                <br />
                Exception: Horizontal scrolling is allowed for the following content:
                <ol>
                    <li>Data tables</li>
                    <li>Photos</li>
                    <li>Maps</li>
                    <li>Charts</li>
                    <li>Games</li>
                    <li>UI with toolbars</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
        See{' '}
        <NewTabLink href="https://www.w3.org/WAI/WCAG22/Understanding/reflow.html">
            Understanding Success Criterion 1.4.10 Reflow
        </NewTabLink>{' '}
        for the current normative details.
    </div>
);

export const Reflow: Requirement = {
    key: AdaptableContentTestStep.reflow,
    name: 'Reflow',
    description: reflowDescription,
    howToTest: reflowHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_4_10],
};
