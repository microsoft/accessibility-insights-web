// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultWidgetPropertyBag } from 'common/types/property-bag/default-widget';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/native-widgets/instructions';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';

import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { InstructionsAndLabelsNotes } from '../../common/instructions-and-labels-note';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If a native widget has a visible label or instructions, they must be programmatically
        determinable.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights native widgets. Native widgets include
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="button" isBold={false} />,
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="input" isBold={false} />,
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="select" isBold={false} />, and
            <Markup.NonBreakingSpace />
            <Markup.Tag tagName="textarea" isBold={false} /> elements.
        </p>
        <InstructionsAndLabelsNotes />
        <ol>
            <li>
                In the target page, examine each highlighted element to determine whether it has a
                visible label or instructions.
            </li>
            <li>
                If a widget does have a visible label or instructions, verify that they are also
                displayed in the <Markup.Term>Instances</Markup.Term> list:
                <ol>
                    <li>
                        The accessible name must be (or include) an exact match of any visible text
                        label.
                    </li>
                    <li>
                        The accessible description must include any additional visible instructions.
                        If any non-text instructions are provided (for example, icons or color
                        changes), the accessible description must include a text equivalent.
                    </li>
                </ol>
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

export const Instructions: Requirement = {
    key: NativeWidgetsTestStep.instructions,
    name: 'Instructions',
    description,
    howToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_5_3],
    ...content,
    columnsConfig: [
        {
            key: 'instructions-info',
            name: 'Instructions',
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
                key: NativeWidgetsTestStep.instructions,
                testType: VisualizationType.NativeWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
