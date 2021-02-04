// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/headings/no-missing-headings';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { HeadingsTestStep } from './test-steps';

const missingHeadingsDescription: JSX.Element = (
    <span>
        Text that <Markup.Emphasis>looks like</Markup.Emphasis> a heading must be{' '}
        <Markup.Emphasis>coded</Markup.Emphasis> as a heading.
    </span>
);

const missingHeadingsHowToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement highlights coded headings in the target page.</p>
        <ol>
            <li>
                Examine the target page to verify that each element that{' '}
                <Markup.Emphasis>looks like a</Markup.Emphasis> heading is{' '}
                <Markup.Emphasis>coded</Markup.Emphasis> as a heading (highlighted).
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoMissingHeadings: Requirement = {
    key: HeadingsTestStep.missingHeadings,
    name: 'No missing headings',
    description: missingHeadingsDescription,
    howToTest: missingHeadingsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_4_1],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['collect-headings'],
                key: HeadingsTestStep.missingHeadings,
                testType: VisualizationType.HeadingsAssessment,
            }),
        ),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
