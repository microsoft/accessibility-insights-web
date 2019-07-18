// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { link } from '../../../content/link';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = <span>Users must be able to cancel functions that can be operated using a single pointer.</span>;

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any functions that can be operated by device motion (such as shaking) or user motion
                (such as walking).
            </li>
            <li>
                Verify that both of the following are true:
                <li>The function is also operable through user interface components (such as a toggle button). </li>
                <li>Motion operation can be disabled by the user.</li>
                Exception: This requirement does not apply if motion activation is
                <NewTabLink href="https://aka.ms/keros/essential"> essential</NewTabLink> to the underlying function, such as tracking a
                user’s steps.
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
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_4],
};
