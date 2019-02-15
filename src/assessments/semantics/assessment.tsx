// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentBuilder } from '../assessment-builder';
import { cssContent } from './test-steps/css-content';

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
    steps: [cssContent],
    storeDataKey: 'semanticsAssessment',
});
