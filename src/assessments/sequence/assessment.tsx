// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentBuilder } from '../assessment-builder';
import { IAssessment } from '../types/iassessment';
import { CssPositioning } from './test-steps/css-positioning';
import { FeatureFlags } from '../../common/feature-flags';
import { LayoutTables } from './test-steps/layout-tables';
import { Columns } from './test-steps/columns';

const key = 'sequence';
const title = 'Sequence';
const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            By default, browsers and assistive technologies present content to users in DOM order (the order that it appears in the HTML).
            When coding is added to modify the apparent order of content, assistive technologies might not be able to programmatically
            determine the intended reading order of content. As a result, people who use assistive technologies might encounter content in
            an order that doesn't make sense.
        </p>
    </React.Fragment>
);

export const SequenceAssessment: IAssessment = AssessmentBuilder.Assisted({
    key,
    title,
    gettingStarted,
    type: VisualizationType.SequenceAssessment,
    steps: [CssPositioning, LayoutTables, Columns],
    storeDataKey: 'sequenceAssessment',
    featureFlag: {
        required: [FeatureFlags.showAllAssessments],
    },
});
