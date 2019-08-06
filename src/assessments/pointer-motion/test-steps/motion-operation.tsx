// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/motion-operation';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>If a function can be operated through motion, it must also be operable through user interface components.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any functions that can be operated by device motion (such as shaking) or user motion
                (such as walking).
            </li>
            <li>
                Verify that both of the following are true:
                <ol>
                    <li>The function is also operable through user interface components (such as a toggle button). </li>
                    <li>Motion operation can be disabled by the user.</li>
                </ol>
                Exception: This requirement does not apply if motion activation is{' '}
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#dfn-essential">essential</NewTabLink> to the underlying function, such as
                tracking a user’s steps.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const MotionOperation: Requirement = {
    key: PointerMotionTestStep.motionOperation,
    name: 'Motion operation',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_4],
};
