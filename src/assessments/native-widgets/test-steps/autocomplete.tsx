// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/native-widgets/autocomplete';
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { DefaultWidgetPropertyBag } from '../../../common/types/property-bag/default-widget';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from '../../../common/types/visualization-type';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Text fields that serve certain purposes must have the correct HTML5{' '}
        <Markup.CodeTerm>autocomplete</Markup.CodeTerm> attribute.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        The visual helper for this requirement highlights text fields.
        <ol>
            <li>
                In the target page, examine each highlighted text field to determine whether it
                serves an{' '}
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#input-purposes">
                    identified input purpose
                </NewTabLink>
                .
            </li>

            <li>
                If a text field <Markup.Emphasis>does</Markup.Emphasis> serve an identified input
                purpose, verify that it has an <Markup.Term>autocomplete</Markup.Term> attribute
                with the correct value.
            </li>

            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = NativeWidgetsTestStep.autocomplete;

const propertyBagConfig: PropertyBagColumnRendererConfig<DefaultWidgetPropertyBag>[] = [
    {
        propertyName: 'inputType',
        displayName: 'Input type',
    },
    {
        propertyName: 'autocomplete',
        displayName: 'Autocomplete',
        defaultValue: NoValue,
    },
];

export const Autocomplete: Requirement = {
    key,
    name: 'Autocomplete',
    description,
    howToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_5],
    ...content,
    columnsConfig: [
        {
            key: 'autocomplete-info',
            name: 'Autocomplete',
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
                rules: ['autocomplete'],
                key,
                testType: VisualizationType.NativeWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
