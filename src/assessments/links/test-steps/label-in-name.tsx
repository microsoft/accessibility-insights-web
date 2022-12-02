// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LabelInNamePropertyBag } from 'common/types/property-bag/label-in-name-property-bag';
import { link } from 'content/link';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/links/label-in-name';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
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
import { labelInNameGetCompletedRequirementDetails } from './label-in-name-get-completed-requirement-details';
import { LinksTestStep } from './test-steps';

const LabelInNameDescription: JSX.Element = (
    <span>A link's accessible name must contain its visible text label.</span>
);

const LabelInNameHowToTest: JSX.Element = (
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

const propertyBagConfig: PropertyBagColumnRendererConfig<LabelInNamePropertyBag>[] = [
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
    {
        propertyName: 'visibleText',
        displayName: 'Visible text',
        defaultValue: NoValue,
    },
    {
        propertyName: 'url',
        displayName: 'URL',
        defaultValue: NoValue,
    },
];

export const LabelInName: Requirement = {
    key: LinksTestStep.labelInName,
    name: 'Label in name',
    description: LabelInNameDescription,
    howToTest: LabelInNameHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_2_5_3],
    columnsConfig: [
        {
            key: 'link-info',
            name: 'Link info',
            onRender:
                PropertyBagColumnRendererFactory.getRenderer<LabelInNamePropertyBag>(
                    propertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['label-in-name'],
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
                ...analyzerConfig,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    getCompletedRequirementDetailsForTelemetry: labelInNameGetCompletedRequirementDetails,
};
