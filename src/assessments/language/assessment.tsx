// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { LanguageOfPage } from './test-steps/language-of-page';
import { LanguageOfParts } from './test-steps/language-of-parts';
import { TextDirection } from './test-steps/text-direction';

const key = 'language';
const title = 'Language';
const { guidance } = content.language;

const gettingStartedText: JSX.Element = (
    <React.Fragment>
        Screen reader technologies can adjust their pronunciation based on language, but only if the
        language is coded correctly. If language changes are not identified, for a screen reader
        user, the speech will sound awkward at best, or unintelligible at worst.
    </React.Fragment>
);

export const LanguageAssessment = AssessmentBuilder.Manual({
    visualizationType: VisualizationType.LanguageAssessment,
    key,
    title,
    gettingStarted: gettingStartedText,
    guidance,
    requirements: [LanguageOfPage, LanguageOfParts, TextDirection],
});
