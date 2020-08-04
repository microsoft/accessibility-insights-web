// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/orientation';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';

const orientationDescription: JSX.Element = (
    <span>Web content must not be locked to a particular screen orientation.</span>
);

const orientationHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Open the target page on a device that automatically reorients web content when the
                device orientation changes (e.g., a mobile device).
            </li>
            <li>Examine the target page with the device oriented vertically, then horizontally.</li>
            <li>
                Verify that the page content reorients when the device's orientation changes.
                <br />
                Exception: Orientation locking is allowed if a specific orientation is{' '}
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#dfn-essential">
                    essential
                </NewTabLink>{' '}
                to the underlying functionality (such as a banking application that requires
                horizontal orientation when photographing a check for deposit).
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Orientation: Requirement = {
    key: AdaptableContentTestStep.orientation,
    name: 'Orientation',
    description: orientationDescription,
    howToTest: orientationHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_4],
};
