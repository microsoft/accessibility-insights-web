// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/dragging-movements';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        The action of dragging cannot be the only means available to perform an action, with
        exceptions on where dragging is essential to the functionality, or the dragging mechanism is
        not built by the web author (e.g., native browser functionality unmodified by the author).
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                <p>
                    Examine the target page to identify elements that support dragging (such as
                    press and hold, repositioning of pointer, releasing the pointer at end point).
                </p>
            </li>
            <li>
                <p>
                    Verify that there is an{' '}
                    <a href="https://www.w3.org/TR/WCAG22/#dfn-single-pointer">single pointer</a>{' '}
                    activation alternative that does not require dragging to operate the same
                    function
                </p>
            </li>
        </ol>
        <p>
            Exception: This criterion does not apply to scrolling enabled by the user-agent.
            Scrolling a page is not in scope, nor is using a technique such as CSS overflow to make
            a section of content scrollable. This criterion also applies to web content that
            interprets pointer actions (i.e. this does not apply to actions that are required to
            operate the user agent or assistive technology).
        </p>
        <ManualTestRecordYourResults isMultipleFailurePossible={true} />
    </div>
);

export const DraggingMovements: Requirement = {
    key: PointerMotionTestStep.draggingMovements,
    name: 'Dragging movements',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_7],
};
