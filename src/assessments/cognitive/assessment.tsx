// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RedundantEntry } from 'assessments/cognitive/test-steps/redundant-entry';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Authentication } from './test-steps/authentication';

const { guidance } = content.cognitive;

const key = 'cognitive';
const title = 'Cognitive';

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            When interfaces require repetitive entry of user data, or necessitate that users recall
            information, solve problems or transcribe information to login, it can unnecessarily
            increase the cognitive load a user must handle. For people with cognitive and/or
            learning disabilities, increasing cognitive load in these ways can lead to unnecessary
            errors with data entry, or create barriers to login to websites or applications.
        </p>
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
