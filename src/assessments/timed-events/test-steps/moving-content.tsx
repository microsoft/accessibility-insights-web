// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/timed-events/moving-content';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { TimedEventsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If content moves, blinks, or scrolls automatically for more than five seconds, users must be able to pause, stop, or hide it.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any information that:
                <ol>
                    <li>Moves, blinks, or scrolls, and</li>
                    <li>Starts automatically, and</li>
                    <li>Lasts more than 5 seconds, and</li>
                    <li>Is presented in parallel with other content, and</li>
                    <li>Is not part of an activity where it is essential.</li>
                </ol>
            </li>
            <li>If you find such content, verify that you can pause, stop, or hide it.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const MovingContent: Requirement = {
    key: TimedEventsTestStep.movingContent,
    name: 'Moving content',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_2_2],
};
