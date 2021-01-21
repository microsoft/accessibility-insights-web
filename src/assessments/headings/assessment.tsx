// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { HeadingFunction } from './test-steps/heading-function';
import { HeadingLevel } from './test-steps/heading-level';
import { NoMissingHeadings } from './test-steps/no-missing-headings';

const key = 'headings';
const title = 'Headings';
const { guidance } = content.headings;

const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            The function of a heading is to label a section of content. Headings should not be used
            as a convenient way to style other text.
        </p>
        <p>
            Assistive technologies use markup tags to help users navigate pages and find content
            more quickly. Screen readers recognize coded headings, and can announce the heading
            along with its level, or provide another audible cue like a beep. Other assistive
            technologies can change the visual display of a page, using properly coded headings to
            display an outline or alternate view.
        </p>
        <p>
            For more information about how to make headings accessible, see
            <NewTabLink href={'https://www.w3.org/TR/WCAG20-TECHS/H42.html'}>
                {' Techniques for WCAG 2.0 - H42: Using h1 - h6 to identify headings.'}
            </NewTabLink>
        </p>
        <p>
            See
            <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2080372">
                {' '}
                this fun video{' '}
            </NewTabLink>
            to learn how landmarks, headings, and tab stops work together to provide efficient
            navigation.{' '}
        </p>
    </React.Fragment>
);

export const HeadingsAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    visualizationType: VisualizationType.HeadingsAssessment,
    gettingStarted,
    title,
    guidance,
    requirements: [HeadingFunction, NoMissingHeadings, HeadingLevel],
    storeDataKey: 'headingsAssessment',
    isEnabled: true,
});
