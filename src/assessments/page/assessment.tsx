// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { FrameTitle } from './test-steps/frame-titles';
import { GeneralNavigation } from './test-steps/general-navigation';
import { PageTitle } from './test-steps/page-title';

const key = 'page';
const pageAssessmentTitle = 'Page navigation';
const { guidance } = content.page;

const pageGettingStartedText: JSX.Element = (
    <p>
        This test addresses a variety of page-level requirements that ensure users can find the
        pages they want.
    </p>
);

export const PageAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    visualizationType: VisualizationType.PageAssessment,
    gettingStarted: pageGettingStartedText,
    title: pageAssessmentTitle,
    guidance,
    requirements: [PageTitle, FrameTitle, GeneralNavigation],
    storeDataKey: 'pageAssessment',
});
