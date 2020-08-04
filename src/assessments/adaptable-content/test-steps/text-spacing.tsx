// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TextLegibilityTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/text-spacing';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';

const textSpacingDescription: JSX.Element = (
    <span>Users must be able to adjust text spacing with no loss of content or functionality.</span>
);

const textSpacingHowToTest: JSX.Element = (
    <div>
        This test uses the{' '}
        <NewTabLink href="https://www.html5accessibility.com/tests/tsbookmarklet.html">
            Text spacing
        </NewTabLink>{' '}
        bookmarklet to adjust text spacing in the target page.
        <ol>
            <li>
                Open{' '}
                <NewTabLink href="https://www.html5accessibility.com/tests/tsbookmarklet.html">
                    Text spacing
                </NewTabLink>{' '}
                in a new browser window.
            </li>
            <li>
                Add the "Bookmarklet: Text Spacing" link from that page to your browser's bookmarks.
                (Mouse users can simply drag the link into the bookmarks bar.)
            </li>
            <li>
                Run the bookmarklet in the browser tab containing your target page. Text styling
                will automatically be adjusted as follows:
                <ol>
                    <li>
                        <Markup.Term>Letter spacing</Markup.Term> (tracking) at 0.12 times the font
                        size{' '}
                    </li>
                    <li>
                        <Markup.Term>Word spacing</Markup.Term> at 0.16 times the font size{' '}
                    </li>
                    <li>
                        <Markup.Term>Line height</Markup.Term> (line spacing) at 1.5 times the font
                        size{' '}
                    </li>
                    <li>
                        <Markup.Term>Spacing after paragraphs</Markup.Term> at 2 times the font size{' '}
                    </li>
                </ol>
            </li>
            <li>
                Verify that all of the following are true:
                <ol>
                    <li>All text responds to each change in styling.</li>
                    <li>All text remains visible (no clipping).</li>
                    <li>There is no overlapping text.</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TextSpacing: Requirement = {
    key: TextLegibilityTestStep.textSpacing,
    name: 'Text spacing',
    description: textSpacingDescription,
    howToTest: textSpacingHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_4_12],
};
