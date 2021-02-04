// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { Caption } from './test-steps/captions';

const key = 'liveMultimedia';
const title = 'Live multimedia';
const { guidance } = content.liveMultimedia;

const gettingStartedText: JSX.Element = (
    <React.Fragment>
        <p>
            Captions help people who are deaf or have a hearing loss watch live (real-time)
            presentations by providing an equivalent alternative for the{' '}
            <Markup.Emphasis>audio</Markup.Emphasis> in multimedia content. Captions should convey
            the dialogue, identify who is speaking, and provide other information conveyed through
            audio, such as music and meaningful sound effects.
        </p>
    </React.Fragment>
);

export const LiveMultimediaAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.LiveMultimediaAssessment,
    key,
    title,
    gettingStarted: gettingStartedText,
    guidance,
    requirements: [Caption],
});
