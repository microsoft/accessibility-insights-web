// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/live-multimedia/captions';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LiveMultimediaTestStep } from './test-steps';

const captionsDescription: JSX.Element = (
    <span>
        Captions must be provided for live (streaming) video with audio.
    </span>
);

const captionsHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any live (streaming)
                multimedia content (video with synchronized audio).
            </li>
            <li>Enable captions, then play the multimedia content.</li>
            <li>Verify that the multimedia content has captions.</li>
            <li>
                If you find any live multimedia content that doesn't have
                captions, select <Markup.Term>Fail</Markup.Term>, then add the
                failure instance.
            </li>
            <li>
                Verify that the captions provide an accurate and complete
                description of the audio content, including speaker identity,
                speech, and meaningful sounds.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Caption: Requirement = {
    key: LiveMultimediaTestStep.liveCaptions,
    name: 'Captions',
    description: captionsDescription,
    howToTest: captionsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_4],
};
