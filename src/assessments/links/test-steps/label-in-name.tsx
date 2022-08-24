// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LabelNamePropertyBag } from 'common/types/property-bag/label-in-name-property-bag';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/links/link-function';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { LinksTestStep } from './test-steps';

const LabelNameDescription: JSX.Element = (
    <span>A link's accessible name must contain its visible text label.</span>
);

const LabelNameHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights links that have visible text on the
            target page.
        </p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, examine each highlighted link to identify its visible text
                label.
            </li>
            <li>
                Compare each link's text visible label to its accessible name (displayed in the{' '}
                <Markup.Term>Instances</Markup.Term> list below).
            </li>
            <li>
                Verify that:
                <ol>
                    <li>The accessible name is an exact match of the visible text label, or</li>

                    <li>
                        The accessible name <Markup.Emphasis>contains</Markup.Emphasis> an exact
                        match of the visible text label, or
                    </li>

                    <li>The link does not have a visible text label. </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<LabelNamePropertyBag>[] = [
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
    {
        propertyName: 'url',
        displayName: 'URL',
        defaultValue: NoValue,
    },
];

export const LabelName: Requirement = {
    key: LinksTestStep.labelName,
    name: 'Label in Name',
    description: LabelNameDescription,
    howToTest: LabelNameHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_2_5_3],
    columnsConfig: [
        {
            key: 'link-info',
            name: 'Link info',
            onRender:
                PropertyBagColumnRendererFactory.getRenderer<LabelNamePropertyBag>(
                    propertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['link-function'],
                key: LinksTestStep.labelName,
                testType: VisualizationType.LinksAssessment,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
