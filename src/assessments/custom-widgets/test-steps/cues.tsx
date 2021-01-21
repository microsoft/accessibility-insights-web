// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CustomWidgetPropertyBag } from 'common/types/property-bag/custom-widgets-property-bag';
import { NoValue } from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/custom-widgets/cues';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const cuesDescription: JSX.Element = (
    <span>
        If a custom widget adopts certain interactive states, it must communicate those states
        programmatically.
    </span>
);

const cuesHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights custom widgets.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, interact with each custom widget to determine whether it adopts
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
export const Cues: Requirement = {
    key: CustomWidgetsTestStep.cues,
    name: 'Cues',
    description: cuesDescription,
    howToTest: cuesHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_4_1_2],
    ...content,
    columnsConfig: [
        {
            key: 'cues-info-custom-widgets',
            name: 'Cues',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<CustomWidgetPropertyBag>([
                {
                    propertyName: 'role',
                    displayName: 'Widget role',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
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
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>('Widget role', 'role'),
        ReportInstanceField.fromPropertyBagFunction<CustomWidgetPropertyBag>(
            'Design pattern',
            'designPattern',
            pb => getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>(
            'HTML cues',
            'htmlCues',
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>(
            'ARIA cues',
            'ariaCues',
        ),
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
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
