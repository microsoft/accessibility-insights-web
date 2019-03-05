// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../../assessments/common/analyzer-configuration-factory';
import { ICustomWidgetPropertyBag } from '../../../common/types/property-bag/icustom-widgets';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName } from '../../../content/strings/application';
import * as content from '../../../content/test/custom-widgets/label';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { TestStep } from '../../types/test-step';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const labelDescription: JSX.Element = <span>A custom widget must have a label and/or instructions that identify the expected input.</span>;

const labelHowToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights custom widgets. <br />
        <Markup.Emphasis>Note: If a custom widget has no programmatically-related label, it will fail an automated check.</Markup.Emphasis>
        <ol>
            <li>
                Examine each widget in the <Markup.Term>Instances</Markup.Term> list below to verify that its accessible name and/or
                instructions identify the expected input, including any unusual or specific formatting requirements.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const Label: TestStep = {
    key: CustomWidgetsTestStep.label,
    name: 'Label',
    description: labelDescription,
    howToTest: labelHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_3_3_2],
    ...content,
    columnsConfig: [
        {
            key: 'label-info-custom-widgets',
            name: 'Label',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<ICustomWidgetPropertyBag>([
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
                    defaultValue: '-',
                },
                {
                    propertyName: 'text',
                    displayName: 'Accesssible name',
                    defaultValue: '-',
                },
                {
                    propertyName: 'describedBy',
                    displayName: 'Accesssible description',
                    defaultValue: '-',
                },
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<ICustomWidgetPropertyBag>('Design pattern', 'designPattern', pb =>
            getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('Accessible name', 'text'),
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('Accessible description', 'describedBy'),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['custom-widget'],
                key: CustomWidgetsTestStep.label,
                testType: VisualizationType.CustomWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
