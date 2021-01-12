// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { AudioOnlyEquivalent } from './test-steps/audio-only-equivalent';
import { VideoOnlyEquivalent } from './test-steps/video-only-equivalent';

const key = 'audioVideoOnly';
const title = 'Audio / video';
const { guidance } = content.audioVideoOnly;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            When pre-recorded audio-only or video-only content is provided, an equivalent
            alternative also must be provided for users who either can't see or can't hear the
            content. These alternatives must convey all the information that the primary content
            conveys.
        </p>
        <p>
            A <Markup.Term>transcript</Markup.Term> can be used to provide a{' '}
            <Markup.Emphasis>text</Markup.Emphasis> equivalent for audio-only or video-only content.
        </p>
        <p>
            An <Markup.Term>audio track</Markup.Term> can be used to provide an{' '}
            <Markup.Emphasis>audio</Markup.Emphasis> equivalent for video-only content.
        </p>
    </React.Fragment>
);

export const AudioVideoOnlyAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.AudioVideOnly,
    key,
    title,
    gettingStarted,
    guidance,
    requirements: [AudioOnlyEquivalent, VideoOnlyEquivalent],
});
