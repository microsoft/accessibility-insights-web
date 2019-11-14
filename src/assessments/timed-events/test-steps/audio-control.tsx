// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/timed-events/audio-control';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { TimedEventsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If audio content plays automatically for longer than three seconds,
        users must be able to pause or mute it.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether it has any audio
                that:
                <ol>
                    <li>Plays automatically, and</li>
                    <li>Lasts more than three seconds.</li>
                </ol>
            </li>
            <li>
                If you find such audio, verify that a mechanism is available,
                either at the beginning of the page/screen content or in
                platform accessibility features, that allows you to:
                <ol>
                    <li>Pause or stop the audio, or</li>
                    <li>
                        Control audio volume independently from the overall
                        system volume level.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const AudioControl: Requirement = {
    key: TimedEventsTestStep.audioControl,
    name: 'Audio control',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_4_2],
};
