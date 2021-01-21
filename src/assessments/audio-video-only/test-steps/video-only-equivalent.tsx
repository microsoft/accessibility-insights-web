// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/audio-video-only/video-only-equivalent';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { AudioVideoOnlyTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Pre-recorded video-only content must be accompanied by an equivalent text or audio
        alternative.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded video-only content:
                <ol>
                    <li>
                        Video-only content <Markup.Emphasis>does not</Markup.Emphasis> include short
                        animation effects, such as a button being highlighted when activated, or a
                        file icon shrinking when the file is closed.
                    </li>
                    <li>
                        Video-only content <Markup.Emphasis>does</Markup.Emphasis> include video
                        content accompanied by sound (such as background music) that does not
                        contribute meaning.
                    </li>
                </ol>
            </li>
            <li>
                Determine whether the video-only content is accompanied by at least one of these
                alternatives:
                <ol>
                    <li>A text transcript</li>
                    <li>An audio track</li>
                </ol>
            </li>
            <li>
                If you find any video-only content that doesn't have a transcript or an audio track,
                select <Markup.Term>Fail</Markup.Term>, then add the failure instance.
            </li>
            <li>Compare the video-only content to the transcript or audio track.</li>
            <li>
                Verify that the transcript or audio track provides an accurate and complete
                description of the video content, including information about actions, characters,
                scene changes, and on-screen text.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const VideoOnlyEquivalent: Requirement = {
    key: AudioVideoOnlyTestStep.videoOnlyEquivalent,
    name: 'Video-only equivalent',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_2_1],
};
