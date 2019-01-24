// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../../assessments/common/analyzer-configuration-factory';
import { ICustomWidgetPropertyBag } from '../../../common/types/property-bag/icustom-widgets';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName } from '../../../content/strings/application';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { TestStep } from '../../types/test-step';
import { ReportInstanceField } from '../../types/report-instance-field';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const cuesDescription: JSX.Element = (
    <span>If a custom widget adopts certain interactive states, it must communicate those states programmatically.</span>
);

const cuesHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights custom widgets.</p>
        <ol>
            <li>
                In the target page, interact with each custom widget to determine whether it adopts any of these states:
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
export const Cues: TestStep = {
    key: CustomWidgetsTestStep.cues,
    name: 'Cues',
    description: cuesDescription,
    howToTest: cuesHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_4_1_2],
    columnsConfig: [
        {
            key: 'cues-info-custom-widgets',
            name: 'Cues',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<ICustomWidgetPropertyBag>([
                {
                    propertyName: 'role',
                    displayName: 'Widget role',
                    defaultValue: '-',
                },
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
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
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('Widget role', 'role'),
        ReportInstanceField.fromPropertyBagFunction<ICustomWidgetPropertyBag>('Design pattern', 'designPattern', pb =>
            getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('HTML cues', 'htmlCues'),
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('ARIA cues', 'ariaCues'),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['custom-widget'],
                key: CustomWidgetsTestStep.cues,
                testType: VisualizationType.CustomWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
