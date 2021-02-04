// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { LandmarkRoles } from './test-steps/landmark-roles';
import { NoRepeatingContent } from './test-steps/no-repeating-content';
import { PrimaryContent } from './test-steps/primary-content';

const key = 'landmarks';
const title = 'Landmarks';
const { guidance } = content.landmarks;
const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            Landmarks help users understand a web page's structure and organization. Adding ARIA
            landmark roles to a page's sections takes structural information that is conveyed
            visually and represents it programmatically. Screen readers and other assistive
            technologies, like browser extensions, can use this information to enable or enhance
            navigation.
        </p>
        <p>
            Landmarks are not required, but if you use them, you must use them correctly. Also, if
            you add Landmarks, you must have a main Landmark.
        </p>
        <p>
            For more information about how to use ARIA landmarks, see{' '}
            <NewTabLink href="https://www.w3.org/TR/wai-aria-practices-1.1/">
                WAI-ARIA Authoring Practices 1.1: Landmark Regions
            </NewTabLink>
            .
        </p>
        <p>
            See{' '}
            <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2080372">
                this fun video
            </NewTabLink>{' '}
            to learn how landmarks, headings, and tab stops work together to provide efficient
            navigation.
        </p>
    </React.Fragment>
);

export const LandmarksAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    title,
    gettingStarted,
    guidance,
    visualizationType: VisualizationType.LandmarksAssessment,
    requirements: [LandmarkRoles, PrimaryContent, NoRepeatingContent],
    storeDataKey: 'landmarksAssessment',
});
