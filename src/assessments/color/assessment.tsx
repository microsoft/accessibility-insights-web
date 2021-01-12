// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { Assessment } from '../types/iassessment';
import { AuditoryCues } from './test-steps/auditory-cues';
import { Flashing } from './test-steps/flashing';
import { SensoryCharacteristics } from './test-steps/sensory-characteristics';
import { UseOfColor } from './test-steps/use-of-color';

const key = 'color';
const colorSensoryAssessmentTitle = 'Sensory';
const { guidance } = content.sensory;

const colorSensoryGettingStartedText: JSX.Element = (
    <React.Fragment>
        <p>
            When color, shape, location, audio, or other sensory characteristics are the only means
            used to convey information, people with disabilities do not have access to the same
            information that others have. Meaning communicated through sensory characteristics must{' '}
            <Markup.Emphasis>also</Markup.Emphasis> be available in a textual format that can be
            viewed by all users and read by screen reader software.{' '}
        </p>
    </React.Fragment>
);

export const ColorSensoryAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    title: colorSensoryAssessmentTitle,
    gettingStarted: colorSensoryGettingStartedText,
    visualizationType: VisualizationType.ColorSensoryAssessment,
    guidance,
    requirements: [UseOfColor, SensoryCharacteristics, AuditoryCues, Flashing],
    storeDataKey: 'colorSensoryAssessment',
});
