// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationType } from '../../common/types/visualization-type';
import { test as content } from '../../content/test';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Contrast } from './test-steps/contrast';
import { HighContrastMode } from './test-steps/high-contrast-mode';
import { ResizeText } from './test-steps/resize-text';

const key = 'textLegibility';
const title = 'Text legibility';
const { guidance } = content.textLegibility;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>In general, larger text and higher contrast makes it easier to read text content.</p>
        <p>
            People with low vision use high contrast mode to ease eye strain or to make the screen easier to read by removing extraneous
            information.
        </p>
        <p>People with low vision and people who need cognitive assistance benefit from increased text size.</p>
        <p>
            Many factors affect peoples' ability to discern between colors/shades, including screen brightness, ambient light, age, color
            blindness, and some types of low vision.
        </p>
    </React.Fragment>
);

export const TextLegibilityAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    type: VisualizationType.TextLegibility,
    title,
    gettingStarted,
    guidance,
    steps: [HighContrastMode, ResizeText, Contrast],
    storeDataKey: 'textLegibilityAssessment',
});
