// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Contrast } from './test-steps/contrast';
import { HighContrastMode } from './test-steps/high-contrast-mode';
import { HoverFocusContent } from './test-steps/hover-focus-content';
import { Orientation } from './test-steps/orientation';
import { Reflow } from './test-steps/reflow';
import { ResizeText } from './test-steps/resize-text';
import { TextSpacing } from './test-steps/text-spacing';

const key = 'textLegibility'; // keeping this as the key for backward compatability, since the test was originally called text legibility
const title = 'Adaptable content';
const { guidance } = content.adaptableContent;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            In general, larger fonts and ample spacing make it easier to read text, especially for
            people with low vision, dyslexia, or presbyopia. A 2018 study found that 1.8 billion
            people worldwide have presbyopia. (All people are affected by presbyopia to some degree
            as they age.)
        </p>
        <p>
            People with low vision use high contrast mode to ease eye strain or to make the screen
            easier to read by removing extraneous information.
        </p>
        <p>
            People with low vision and people who need cognitive assistance benefit from increased
            text size.
        </p>
        <p>
            Many factors affect peoples' ability to discern between colors/shades, including screen
            brightness, ambient light, age, color blindness, and some types of low vision.
        </p>
    </React.Fragment>
);

export const AdaptableContentAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    visualizationType: VisualizationType.AdaptableContent,
    title,
    gettingStarted,
    guidance,
    requirements: [
        HighContrastMode,
        ResizeText,
        Contrast,
        Orientation,
        Reflow,
        TextSpacing,
        HoverFocusContent,
    ],
    storeDataKey: 'adaptableContentAssessment',
});
