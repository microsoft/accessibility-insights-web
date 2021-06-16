// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AnalyzerConfigurationFactory } from 'assessments/common/analyzer-configuration-factory';
import { CuesPropertyBag } from 'common/types/property-bag/cues';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/native-widgets/cues';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If a native widget adopts certain interactive states, it must provide appropriate cues.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, {productName} highlights native widgets. Native widgets include
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="button" isBold={true} />,
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="input" isBold={true} />,
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="select" isBold={true} />, and
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="textarea" isBold={true} /> elements.
        </p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, interact with each native widget to determine whether it adopts
                any of these states:
                <ol>
                    <li>Disabled</li>
                    <li>Read-only</li>
                    <li>Required</li>
                </ol>
            </li>
            <li>
                If a widget <Markup.Emphasis>does</Markup.Emphasis> adopt any of these states,
                inspect its HTML using the browser Developer Tools to verify that the states are
                appropriately coded.
                <ol>
                    <li>
                        HTML properties (e.g., <Markup.CodeTerm>readonly</Markup.CodeTerm>) should
                        be used on elements that support them.
                    </li>
                    <li>
                        ARIA properties (e.g., <Markup.CodeTerm>aria-readonly</Markup.CodeTerm>)
                        should be used on elements that don't support HTML properties.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<CuesPropertyBag>[] = [
    {
        propertyName: 'element',
        displayName: 'Element',
        defaultValue: NoValue,
    },
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
    {
        propertyName: 'htmlCues',
        displayName: 'HTML cues',
        defaultValue: NoValue,
        expand: true,
    },
    {
        propertyName: 'ariaCues',
        displayName: 'ARIA cues',
        defaultValue: NoValue,
        expand: true,
    },
];

export const Cues: Requirement = {
    key: NativeWidgetsTestStep.cues,
    name: 'Cues',
    description,
    howToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_4_1_2],
    ...content,
    columnsConfig: [
        {
            key: 'cues-info',
            name: 'Cues',
            onRender:
                PropertyBagColumnRendererFactory.getRenderer<CuesPropertyBag>(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['cues'],
                key: NativeWidgetsTestStep.cues,
                testType: VisualizationType.NativeWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
