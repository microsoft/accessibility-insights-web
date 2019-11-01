// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/landmarks/primary-content';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LandmarkTestStep } from './test-steps';

const description: JSX.Element = <span>The main landmark must contain all of the page's primary content.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement highlights the page's main landmark.</p>
        <ol>
            <li>
                In the target page, examine the <Markup.CodeTerm>main</Markup.CodeTerm> landmark to verify that it contains all of the
                page's primary content.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const PrimaryContent: Requirement = {
    key: LandmarkTestStep.primaryContent,
    name: 'Primary content',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_4_1],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['main-landmark'],
                key: LandmarkTestStep.primaryContent,
                testType: VisualizationType.LandmarksAssessment,
            }),
        ),
    getDrawer: provider => provider.createLandmarksDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    ...content,
};
