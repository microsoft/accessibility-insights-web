// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/sensory/flashing';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ColorSensoryTestStep } from './test-steps';

const flashingHowToTest: JSX.Element = (
    <React.Fragment>
        <ol>
            <li>Examine the target page to identify any content that flashes.</li>
            <li>
                If you find such content, determine whether it flashes faster than three times per
                second.
                <ol>
                    <li>
                        Use this{' '}
                        <NewTabLink
                            aria-label="Go to a page with an example of flashing content"
                            href="../../assessments/color/test-steps/flashing-text-example.html"
                        >
                            link
                        </NewTabLink>{' '}
                        to see an example of content that flashes three times per second. (The
                        example will open in a new browser window.)
                    </li>
                </ol>
            </li>
            <li>
                For any content that flashes faster than three times per second, verify that at
                least one of the following is true:
                <ol>
                    <li>The total flashing area is smaller than 21,824 pixels (in any shape).</li>
                    <li>
                        The relative luminance between the brightest and darkest portions of the
                        flash is less than 10% and the flash does not include any saturated red.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </React.Fragment>
);

const flashingDescription: JSX.Element = (
    <span>Web pages must not have content that flashes more than three times per second.</span>
);

export const Flashing: Requirement = {
    key: ColorSensoryTestStep.flashing,
    name: 'Flashing',
    description: flashingDescription,
    howToTest: flashingHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_3_1],
};
