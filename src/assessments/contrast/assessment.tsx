// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';

import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Graphics } from './test-steps/graphics';
import { StateChanges } from './test-steps/state-changes';
import { UIComponents } from './test-steps/ui-components';

const { guidance } = content.contrast;
const key = 'contrast';
const title = 'Contrast';

const gettingStarted: JSX.Element = (
    <>
        <p>
            Contrast ratio describes the relative brightness of foreground and background colors on
            a computer display. In general, higher contrast ratios make text and graphics easier to
            perceive and read. Black and white have the highest possible contrast ratio, 21:1.
            Identical colors have the lowest possible contrast ratio, 1:1. All other color
            combinations fall somewhere in between.
        </p>
    </>
);

export const ContrastAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    title: title,
    gettingStarted: gettingStarted,
    guidance,
    visualizationType: VisualizationType.ContrastAssessment,
    requirements: [UIComponents, StateChanges, Graphics],
});
