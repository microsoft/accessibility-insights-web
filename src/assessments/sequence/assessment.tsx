// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { Columns } from './test-steps/columns';
import { CssPositioning } from './test-steps/css-positioning';
import { LayoutTables } from './test-steps/layout-tables';

const key = 'sequence';
const title = 'Sequence';
const { guidance } = content.sequence;
const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            By default, browsers and assistive technologies present content to users in DOM order
            (the order that it appears in the HTML). When coding is added to modify the apparent
            order of content, assistive technologies might not be able to programmatically determine
            the intended reading order of content. As a result, people who use assistive
            technologies might encounter content in an order that doesn't make sense.
        </p>
    </React.Fragment>
);

export const SequenceAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    title,
    gettingStarted,
    guidance,
    visualizationType: VisualizationType.SequenceAssessment,
    requirements: [CssPositioning, LayoutTables, Columns],
    storeDataKey: 'sequenceAssessment',
});
