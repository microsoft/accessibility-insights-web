// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CustomWidgetPropertyBag } from 'common/types/property-bag/icustom-widgets';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/custom-widgets/instructions';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { NoValue } from '../../common/property-bag-column-renderer';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const instructionsDescription: JSX.Element = (
    <span>If a custom widget has visible instructions, they must be programmatically related to it.</span>
);

const instructionsHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights custom widgets.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                For each widget, verify that any instructions visible in the target page are also visible in the{' '}
                <Markup.Term>Instances</Markup.Term> list.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const Instructions: Requirement = {
    key: CustomWidgetsTestStep.instructions,
    name: 'Instructions',
    description: instructionsDescription,
    howToTest: instructionsHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1],
    ...content,
    columnsConfig: [
        {
            key: 'instruction-info-custom-widgets',
            name: 'Instructions',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<CustomWidgetPropertyBag>([
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'text',
                    displayName: 'Accessible name',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'describedBy',
                    displayName: 'Accessible description',
                    defaultValue: NoValue,
                },
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<CustomWidgetPropertyBag>('Design pattern', 'designPattern', pb =>
            getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>('Accessible name', 'text'),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>('Accessible description', 'describedBy'),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['custom-widget'],
                key: CustomWidgetsTestStep.instructions,
                testType: VisualizationType.CustomWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
