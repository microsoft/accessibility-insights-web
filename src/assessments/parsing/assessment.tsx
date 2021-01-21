// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Parsing } from './test-steps/parsing';

const key = 'parsing';
const title = 'Parsing';
const { guidance } = content.parsing;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            The requirements in this test ensure that parsing errors don't disrupt assistive
            technology.
        </p>
    </React.Fragment>
);

export const ParsingAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.ParsingAssessment,
    key,
    title,
    gettingStarted,
    guidance,
    requirements: [Parsing],
    isEnabled: true,
});
