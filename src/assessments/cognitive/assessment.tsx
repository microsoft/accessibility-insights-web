// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RedundantEntry } from 'assessments/cognitive/test-steps/redundant-entry';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Authentication } from './test-steps/authentication';

const { guidance } = content.pointerMotion;

const key = 'cognitive';
const title = 'Cognitive';

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>Placeholder for Cognitive Assessment Getting Started.</p>
    </React.Fragment>
);

export const CognitiveAssessment: Assessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.CognitiveAssessment,
    key,
    title,
    gettingStarted,
    guidance,
    requirements: [RedundantEntry, Authentication],
    isEnabled: true,
});
