// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultWidgetPropertyBag } from 'common/types/property-bag/default-widget';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import * as content from 'content/test/native-widgets/expected-input';
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
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        A native widget must have a label and/or instructions that identify the expected input.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights native widgets.</p>
        <p>
            <Markup.Emphasis>
                Notes: (1) If no matching/failing instances are found, this requirement will
                automatically be marked as pass. (2) If a native widget has no
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

const propertyBagConfig: PropertyBagColumnRendererConfig<DefaultWidgetPropertyBag>[] = [
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
        propertyName: 'accessibleDescription',
        displayName: 'Accessible description',
        defaultValue: NoValue,
    },
];

export const ExpectedInput: Requirement = {
    key: NativeWidgetsTestStep.label, // DO NOT CHANGE THE KEY, doing so may break user on-going assessment
    name: 'Expected input',
    description,
    howToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_3_3_2],
    ...content,
    columnsConfig: [
        {
            key: 'label-info',
            name: 'Label',
            onRender:
                PropertyBagColumnRendererFactory.getRenderer<DefaultWidgetPropertyBag>(
                    propertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['native-widgets-default'],
                key: NativeWidgetsTestStep.label,
                testType: VisualizationType.NativeWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
