// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CustomWidgetPropertyBag } from 'common/types/property-bag/custom-widgets-property-bag';
import { NoValue } from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import * as content from 'content/test/custom-widgets/expected-input';
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

const labelDescription: JSX.Element = (
    <span>
        A custom widget must have a label and/or instructions that identify the expected input.
    </span>
);

const labelHowToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights custom widgets. <br />
        <p>
            <Markup.Emphasis>
                Note: (1) If no matching/failing instances are found, this requirement will
                automatically be marked as pass. (2) If a custom widget has no
                programmatically-related label, it will fail an automated check.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>
                Examine each widget in the <Markup.Term>Instances</Markup.Term> list below to verify
                that its accessible name and/or instructions identify the expected input, including
                any unusual or specific formatting requirements.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const ExpectedInput: Requirement = {
    key: CustomWidgetsTestStep.label, // DO NOT CHANGE THE KEY, doing so may break user on-going assessment
    name: 'Expected input',
    description: labelDescription,
    howToTest: labelHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_3_3_2],
    ...content,
    columnsConfig: [
        {
            key: 'label-info-custom-widgets',
            name: 'Label',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<CustomWidgetPropertyBag>([
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'accessibleName',
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
        ReportInstanceField.fromPropertyBagFunction<CustomWidgetPropertyBag>(
            'Design pattern',
            'designPattern',
            pb => getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>(
            'Accessible name',
            'text',
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>(
            'Accessible description',
            'describedBy',
        ),
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
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
