// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/multimedia/captions';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PrerecordedMultimediaTestStep } from './test-steps';

const captionsDescription: JSX.Element = (
    <span>Pre-recorded multimedia content must have captions.</span>
);

const captionsHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded multimedia content
                (synchronized video and audio).
            </li>
            <ol>
                <li>
                    Ignore any multimedia content that is provided as an audio or video alternative
                    to text and is clearly labeled as such.
                </li>
            </ol>
            <li>Enable captions, then play the multimedia content.</li>
            <li>Verify that the multimedia content has captions.</li>
            <li>
                If you find any multimedia content that doesn't have captions, select{' '}
                <Markup.Term>Fail</Markup.Term>, then add the failure instance.
            </li>
            <li>
                Verify that the captions provide an accurate and complete description of the audio
                content, including speaker identity, speech, and meaningful sounds.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Captions: Requirement = {
    key: PrerecordedMultimediaTestStep.captions,
    name: 'Captions',
    description: captionsDescription,
    howToTest: captionsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_2],
};
