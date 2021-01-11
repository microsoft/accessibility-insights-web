// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { BypassBlocks } from './test-steps/bypass-blocks';
import { ConsistentIdentification } from './test-steps/consistent-identification';
import { ConsistentNavigation } from './test-steps/consistent-navigation';

const key = 'repetitiveContent';
const title = 'Repetitive content';
const { guidance } = content.repetitiveContent;

const gettingStartedText: JSX.Element = (
    <React.Fragment>
        <p>
            When interacting with a website or web app, keyboard users need a way to skip repetitive
            content and navigate directly to the page's primary content.
        </p>
        <p>
            Content that appears repeatedly within a website or web app must be presented
            consistently to allow users to locate specific information efficiently.
        </p>
    </React.Fragment>
);

export const RepetitiveContentAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.RepetitiveContentAssessment,
    key,
    gettingStarted: gettingStartedText,
    title,
    guidance,
    requirements: [BypassBlocks, ConsistentNavigation, ConsistentIdentification],
});
