// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HeadingsAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/headings/heading-level';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { headingsAssessmentInstanceDetailsColumnRenderer } from '../headings-instance-details-column-renderer';
import { HeadingsTestStep } from './test-steps';

const headingLevelDescription: JSX.Element = (
    <span>
        A heading's <Markup.Emphasis>programmatic</Markup.Emphasis> level must match the level
        that's presented <Markup.Emphasis>visually</Markup.Emphasis>.
    </span>
);

const headingLevelHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights coded headings in the target page.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, examine each heading to verify that its{' '}
                <Markup.Emphasis>programmatic</Markup.Emphasis> level matches the level that's
                presented <Markup.Emphasis>visually</Markup.Emphasis> (through font style).
                <ol>
                    <li>
                        Lower-level headings should be more prominent than higher-level headings.
                        (Level 1 should be the most prominent, level 6 the least.)
                    </li>
                    <li>Headings of the same level should have the same font style.</li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const HeadingLevel: Requirement = {
    key: HeadingsTestStep.headingLevel,
    name: 'Heading level',
    description: headingLevelDescription,
    howToTest: headingLevelHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
    columnsConfig: [
        {
            key: 'heading-level-and-text',
            name: 'Heading level / Heading text',
            onRender: headingsAssessmentInstanceDetailsColumnRenderer,
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagField<HeadingsAssessmentProperties>(
            'Heading text',
            'headingText',
        ),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['collect-headings'],
                key: HeadingsTestStep.headingLevel,
                testType: VisualizationType.HeadingsAssessment,
            }),
        ),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
