// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdaptableContentTestStep } from 'assessments/adaptable-content/test-steps/test-step';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/adaptable-content/text-spacing';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';

import * as Markup from '../../markup';

const textSpacingDescription: JSX.Element = (
    <span>Users must be able to adjust text spacing with no loss of content or functionality.</span>
);

const textSpacingHowToTest: JSX.Element = (
    <div>
        The visual helper for this requirement adjusts the target page's text styling as follows:
        <ul>
            <li>
                <Markup.Term>Letter spacing</Markup.Term> (tracking) at 0.12 times the font size
            </li>
            <li>
                <Markup.Term>Word spacing</Markup.Term> at 0.16 times the font size
            </li>
            <li>
                <Markup.Term>Line height</Markup.Term> (line spacing) at 1.5 times the font size
            </li>
            <li>
                <Markup.Term>Spacing after paragraphs</Markup.Term> at 2 times the font size
            </li>
        </ul>
        <ol>
            <li>Toggle the visual helper to adjust text spacing in the target page.</li>
            <li>
                Verify that all of the following are true:
                <ol>
                    <li>All text responds to each change in styling.</li>
                    <li>All text remains visible (no clipping).</li>
                    <li>There is no overlapping text.</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TextSpacing: Requirement = {
    key: AdaptableContentTestStep.textSpacing,
    name: 'Text spacing',
    description: textSpacingDescription,
    howToTest: textSpacingHowToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_4_12],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['text-spacing'],
                key: AdaptableContentTestStep.textSpacing,
                testType: VisualizationType.AdaptableContent,
            }),
        ),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    getDrawer: provider =>
        provider.createSingleTargetDrawer('insights-formatted-text-spacing-container'),
};
