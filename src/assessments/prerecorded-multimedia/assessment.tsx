// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { AudioDescription } from './test-steps/audio-description';
import { Captions } from './test-steps/captions';
import { NoConflict } from './test-steps/no-conflict';
import { NoObstruction } from './test-steps/no-obstruction';
import { Synchronization } from './test-steps/synchronization';

const key = 'prerecordedMultimedia';
const title = 'Multimedia';
const { guidance } = content.multimedia;

const gettingStartedText: JSX.Element = (
    <React.Fragment>
        <p>
            When pre-recorded multimedia content (synchronized video and audio) is provided,
            equivalent alternatives also must be provided for people who either can't hear the audio
            or can't see the video.
        </p>
        <p>
            <Markup.Term>Captions</Markup.Term> help people who are deaf or have a hearing loss by
            providing an equivalent alternative for the <Markup.Emphasis>audio</Markup.Emphasis> in
            multimedia content. Captions should convey the dialogue, identify who is speaking, and
            provide other information conveyed through audio, such as music and sound effects.
        </p>
        <p>
            <Markup.Term>Audio description</Markup.Term> helps blind and low vision people by
            providing an equivalent alternative for the <Markup.Emphasis>video</Markup.Emphasis> in
            multimedia content. Audio description should include information about actions,
            characters, scene changes, on-screen text, and other visual content.
        </p>
    </React.Fragment>
);

export const PrerecordedMultimediaAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.PrerecordedMultimediaAssessment,
    key,
    gettingStarted: gettingStartedText,
    title,
    guidance,
    requirements: [Captions, NoObstruction, AudioDescription, Synchronization, NoConflict],
});
