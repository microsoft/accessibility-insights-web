// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FeatureFlags } from '../../common/feature-flags';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentBuilder } from '../assessment-builder';
import { CssContent } from './test-steps/css-content';
import { DataTables } from './test-steps/data-tables';
import { Emphasis } from './test-steps/emphasis';
import { SemanticsLists } from './test-steps/lists';

const key = 'semanticsAssessment';
const title = 'Semantics';

const SemanticsAssessmentGettingStarted: JSX.Element = <>SemanticsAssessmentGettingStarted</>;

export const SemanticsAssessment = AssessmentBuilder.Assisted({
    key,
    title,
    gettingStarted: SemanticsAssessmentGettingStarted,
    type: VisualizationType.SemanticsAssessment,
    steps: [CssContent, DataTables, Emphasis, SemanticsLists],
    storeDataKey: 'semanticsAssessment',
    featureFlag: {
        required: [FeatureFlags.showAllAssessments],
    },
});
