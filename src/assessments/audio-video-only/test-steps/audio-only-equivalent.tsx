// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/audio-video-only/audio-only-equivalent';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { AudioVideoOnlyTestStep } from './test-steps';

const description: JSX.Element = <span>Pre-recorded audio-only content must be accompanied by an equivalent text alternative.</span>;

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded audio-only content:
                <ol>
                    <li>
                        Audio-only content <Markup.Emphasis>does not</Markup.Emphasis> include:
                        <ol>
                            <li>Audio synchronized with video, slides, animations, or other time-based visuals.</li>
                            <li>Short sounds such as confirmation beeps or error notifications.</li>
                        </ol>
                    </li>
                    <li>
                        Audio-only content <Markup.Emphasis>does</Markup.Emphasis> include audio accompanied by simple static visuals, such
                        as the title of a speech and the speaker's name.
                    </li>
                </ol>
            </li>
            <li>Determine whether the audio-only content is accompanied by a text transcript.</li>
            <li>
                If you find any audio-only content that doesn't have a transcript, select <Markup.Term>Fail</Markup.Term>, then add the
                failure instance.
            </li>
            <li>Compare the audio-only content to the transcript.</li>
            <li>Verify that the transcript provides an accurate and complete description of the audio content.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const AudioOnlyEquivalent: Requirement = {
    key: AudioVideoOnlyTestStep.audioOnlyEquivalent,
    name: 'Audio-only equivalent',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_2_1],
};
