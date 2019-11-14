// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/pointer-gestures';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Functions must be operable without requiring multipoint or path-based
        gestures.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any functions that can be
                operated using either of the following:
                <ol>
                    <li>
                        <Markup.Term>Multipoint gestures</Markup.Term>, such as
                        a two-fingered pinch zoom or a three-fingered tap.
                    </li>
                    <li>
                        <Markup.Term>Path-based gestures</Markup.Term>, such as
                        dragging or swiping.
                    </li>
                </ol>
            </li>
            <li>
                Verify that the function is{' '}
                <Markup.Emphasis>also</Markup.Emphasis> operable using a
                single-point, non-path-based gesture, such as a double-click or
                a long press.
                <br />
                Exception: Multi-point and path-based gestures are allowed where
                they are
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#dfn-essential">
                    {' '}
                    essential
                </NewTabLink>{' '}
                to the underlying function, such as freehand drawing.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const PointerGestures: Requirement = {
    key: PointerMotionTestStep.pointerGestures,
    name: 'Pointer gestures',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_1],
};
