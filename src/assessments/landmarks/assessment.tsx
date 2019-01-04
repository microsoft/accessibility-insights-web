// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentBuilder } from '../assessment-builder';
import { IAssessment } from '../types/iassessment';
import { LandmarkRoles } from './test-steps/landmark-roles';
import { NoRepeatingContent } from './test-steps/no-repeating-content';
import { PrimaryContent } from './test-steps/primary-content';
import { test as content } from '../../content/test';

const key = 'landmarks';
const landmarksAssessmenttitle = 'Landmarks';
const { guidance } = content.landmarks;
const landmarksAssessmentGettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            Landmarks help users understand a web page's structure and organization.
            Adding ARIA landmark roles to a page's sections takes structural information
            that is conveyed visually and represents it programmatically.
            Screen readers and other assistive technologies, like browser extensions,
            can use this information to enable or enhance navigation.
        </p>
        <p>
            For more information about how to use ARIA landmarks,
            see <NewTabLink href="https://www.w3.org/TR/wai-aria-practices-1.1/">
                WAI-ARIA Authoring Practices 1.1: Landmark Regions
            </NewTabLink>.
        </p>
        <p>
            See <NewTabLink href="https://msit.microsoftstream.com/video/a872fda0-4b9e-453b-9adf-e02a38b1900b?channelId=66d47e66-d99c-488b-b9ea-98a153d2a4d4">
                this fun video
            </NewTabLink> to learn how landmarks,
            headings, and tab stops work together to provide efficient navigation.
        </p>
    </React.Fragment>
);

export const LandmarksAssessment: IAssessment = AssessmentBuilder.Assisted({
    key,
    title: landmarksAssessmenttitle,
    gettingStarted: landmarksAssessmentGettingStarted,
    guidance,
    type: VisualizationType.LandmarksAssessment,
    steps: [
        LandmarkRoles,
        PrimaryContent,
        NoRepeatingContent,
    ],
    storeDataKey: 'landmarksAssessment',
});
