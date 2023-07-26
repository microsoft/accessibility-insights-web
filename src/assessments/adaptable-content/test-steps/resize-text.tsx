// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/resize-text';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Emphasis } from '../../markup';

const resizeTextInstructionsURL =
    '/insights.html#/content/test/adaptableContent/resizeTextInstructions';

const resizeTextDescription: JSX.Element = (
    <span>
        Users must be able to resize text, without using assistive technology, up to 200% with no
        loss of content or functionality.
    </span>
);

const resizeTextHowToTest: JSX.Element = (
    <div>
        <Emphasis>
            Note: An automated check will fail if text scaling and zooming is disabled because the
        </Emphasis>
        &nbsp;
        <Markup.CodeTerm>user-scalable=no</Markup.CodeTerm>{' '}
        <Emphasis>parameter is used in a</Emphasis>&nbsp;
        <Markup.CodeTerm>{`<meta name="viewport">`}</Markup.CodeTerm> <Emphasis> element.</Emphasis>
        &nbsp;
        <ol>
            <li>
                Set your display width to 1280 logical pixels using{' '}
                <NewTabLink href={resizeTextInstructionsURL}>these instructions</NewTabLink>.
            </li>
            <li>Put the browser into full-screen mode.</li>
            <li>
                Examine the target page to verify that:
                <ol>
                    <li>All text resizes fully, including text in form fields.</li>
                    <li>Text isn't clipped, truncated, or obscured.</li>
                    <li>All content remains available.</li>
                    <li>All functionality remains available.</li>
                </ol>
                Exception: Images of text and captions for videos are exempt from this requirement.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ResizeText: Requirement = {
    key: AdaptableContentTestStep.resizeText,
    name: 'Resize text',
    description: resizeTextDescription,
    howToTest: resizeTextHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_4_4],
};
