// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HeadingsAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/headings/heading-function';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { headingsAssessmentInstanceDetailsColumnRenderer } from '../headings-instance-details-column-renderer';
import { HeadingsTestStep } from './test-steps';

const headingFunctionDescription: JSX.Element = (
    <span>
        An element <Markup.Emphasis>coded</Markup.Emphasis> as a heading must{' '}
        <Markup.Emphasis>function</Markup.Emphasis> as a heading.
    </span>
);

const headingFunctionHowToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, {productName} highlights coded headings in the target page. Coded
            headings include HTML tags <Markup.Tag tagName="h1" /> through{' '}
            <Markup.Tag tagName="h6" /> and elements with <Markup.Term>role="heading"</Markup.Term>.
        </p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, examine each highlighted element to verify that it{' '}
                <Markup.Emphasis>functions</Markup.Emphasis> as a heading:
                <ol>
                    <li>
                        An element functions as a heading if it serves as a descriptive label for
                        the section of content that follows it.
                    </li>
                    <li>
                        An element does not function as a heading if it serves any other purpose.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const HeadingFunction: Requirement = {
    key: HeadingsTestStep.headingFunction,
    name: 'Heading function',
    description: headingFunctionDescription,
    howToTest: headingFunctionHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_4_6],
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
                key: HeadingsTestStep.headingFunction,
                testType: VisualizationType.HeadingsAssessment,
            }),
        ),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
