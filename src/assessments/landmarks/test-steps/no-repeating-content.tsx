// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/landmarks/no-repeating-content';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LandmarkTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        The main landmark must not contain any blocks of content that repeat
        across pages.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights the page's{' '}
            <Markup.CodeTerm>main</Markup.CodeTerm> landmark.
        </p>
        <ol>
            <li>
                In the target page, examine the main landmark to verify that it
                does not contain any blocks of content that repeat across pages
                (e.g., site-wide navigation links).
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoRepeatingContent: Requirement = {
    key: LandmarkTestStep.noRepeatingContent,
    name: 'No repeating content',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_4_1],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['main-landmark'],
                key: LandmarkTestStep.noRepeatingContent,
                testType: VisualizationType.LandmarksAssessment,
            }),
        ),
    getDrawer: provider => provider.createLandmarksDrawer(),
    getVisualHelperToggle: props => (
        <AssessmentVisualizationEnabledToggle {...props} />
    ),
    ...content,
};
