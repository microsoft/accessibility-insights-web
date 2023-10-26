// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Authentication } from './test-steps/authentication';
import { RedundantEntry } from 'assessments/cognitive/test-steps/redundant-entry';

const key = 'keyboardInteraction';
const title = 'Cognitive';

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>Placeholder for Cognitive Assessment Getting Started.</p>
    </React.Fragment>
);

export const Cognitive: Assessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.ParsingAssessment,
    key,
    title,
    gettingStarted,
    requirements: [RedundantEntry, Authentication],
    isEnabled: true,
});
