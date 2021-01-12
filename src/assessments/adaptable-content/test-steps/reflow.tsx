// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/reflow';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';

const reflowDescription: JSX.Element = (
    <span>Content must be visible without having to scroll in two dimensions.</span>
);

const reflowHowToTest: JSX.Element = (
    <div>
        The following steps assume the page uses a script read horizontally (left-to-right or
        right-to-left) rather than vertically (top-to-bottom).
        <ol>
            <li>
                Use your system's display settings to set the display resolution to 1280 x 1024.
            </li>
            <li>Use your browser's settings to set the target page's zoom to 400%.</li>
            <li>
                Examine the target page to verify that all text content is available without
                horizontal scrolling. Content can be displayed directly in the page, revealed via
                accessible controls, or accessed via direct links.
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
