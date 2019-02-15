// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { test as content } from '../../content/test';

const key = 'semanticsAssessment';
const title = 'Semantics';

const SemanticsAssessmentGettingStarted: JSX.Element = (
    <>
        SemanticsAssessmentGettingStarted
    </>
);

export const LinksAssessment = AssessmentBuilder.Assisted({
    key,
    title: title,
    gettingStarted: SemanticsAssessmentGettingStarted,
    type: -1,
    steps: [],
    storeDataKey: 'semanticsAssessment',
});
