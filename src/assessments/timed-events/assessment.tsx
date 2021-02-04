// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { AudioControl } from './test-steps/audio-control';
import { AutoUpdatingContent } from './test-steps/auto-updating-content';
import { MovingContent } from './test-steps/moving-content';
import { TimeLimits } from './test-steps/time-limits';

const key = 'timedEvents';
const timedEventsAssessmentTitle = 'Timed events';
const { guidance } = content.timedEvents;

const timedEventAssessmentGettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            People who use screen readers or voice input and people with cognitive disabilities
            might need more time than other users to assimilate the information and execute the
            controls on a website or web app.
        </p>
        <p>
            People who have trouble focusing might need a way to decrease the distractions created
            by movement in an application.
        </p>
        <p>
            People who use screen readers might find it hard to hear the speech output if there is
            other audio playing at the same time.
        </p>
    </React.Fragment>
);

export const TimedEventsAssessment: Assessment = AssessmentBuilder.Manual({
    key,
    title: timedEventsAssessmentTitle,
    gettingStarted: timedEventAssessmentGettingStarted,
    visualizationType: VisualizationType.TimedEventsAssessment,
    guidance,
    requirements: [TimeLimits, MovingContent, AutoUpdatingContent, AudioControl],
});
