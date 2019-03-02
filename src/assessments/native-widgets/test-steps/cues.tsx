// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../../assessments/common/analyzer-configuration-factory';
import { ICuesPropertyBag } from '../../../common/types/property-bag/icues';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName } from '../../../content/strings/application';
import * as content from '../../../content/test/native-widgets/cues';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import { IPropertyBagColumnRendererConfig } from '../../common/property-bag-column-renderer';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { TestStep } from '../../types/test-step';
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = <span>If a native widget adopts certain interactive states, it must provide appropriate cues.</span>;

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
        <ol>
            <li>
                In the target page, interact with each native widget to determine whether it adopts any of these states:
                <ol>
                    <li>Disabled</li>
                    <li>Read-only</li>
                    <li>Required</li>
                </ol>
            </li>
            <li>
                If a widget <Markup.Emphasis>does</Markup.Emphasis> adopt any of these states, inspect its HTML using the Chrome Developer
                Tools to verify that the states are appropriately coded.
                <ol>
                    <li>
                        HTML properties (e.g., <Markup.CodeTerm>readonly</Markup.CodeTerm>) should be used on elements that support them.
                    </li>
                    <li>
                        ARIA properties (e.g., <Markup.CodeTerm>aria-readonly</Markup.CodeTerm>) should be used on elements that don't
                        support HTML properties.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: IPropertyBagColumnRendererConfig<ICuesPropertyBag>[] = [
    {
        propertyName: 'element',
        displayName: 'Element',
        defaultValue: '-',
    },
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: '-',
    },
    {
        propertyName: 'htmlCues',
        displayName: 'HTML cues',
        defaultValue: '-',
        expand: true,
    },
    {
        propertyName: 'ariaCues',
        displayName: 'ARIA cues',
        defaultValue: '-',
        expand: true,
    },
];

export const Cues: TestStep = {
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
            onRender: PropertyBagColumnRendererFactory.get<ICuesPropertyBag>(propertyBagConfig),
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
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
