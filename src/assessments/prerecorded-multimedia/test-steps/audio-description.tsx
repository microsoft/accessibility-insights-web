// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/multimedia/audio-description';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PrerecordedMultimediaTestStep } from './test-steps';

const audioDescription: JSX.Element = (
    <span>Pre-recorded video with audio must have an audio description.</span>
);

const audioHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded multimedia content (video with
                synchronized audio).
            </li>
            <li>Enable audio descriptions, then play the multimedia content.</li>
            <li>Verify that the multimedia content has an audio description.</li>
            <li>
                If you find any pre-recorded multimedia content that doesn't have an audio
                description, select <Markup.Term>Fail</Markup.Term>, then add the failure instance.
            </li>
            <li>
                Verify that the audio description adequately describes important visual content in
                the media, including information about actions, characters, scene changes, and
                on-screen text.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const AudioDescription: Requirement = {
    key: PrerecordedMultimediaTestStep.audioDescription,
    name: 'Audio description',
    description: audioDescription,
    howToTest: audioHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_3, link.WCAG_1_2_5],
};
