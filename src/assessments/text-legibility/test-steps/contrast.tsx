// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { PropertyBagColumnRendererFactory } from '../../../assessments/common/property-bag-column-renderer-factory';
import { TextLegibilityTestStep } from '../../../assessments/text-legibility/test-steps/test-step';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { ContrastPropertyBag } from '../../../common/types/property-bag/icontrast';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName, windowsPlatformTitle } from '../../../content/strings/application';
import * as content from '../../../content/test/text-legibility/contrast';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import { NoValue, PropertyBagColumnRendererConfig } from '../../common/property-bag-column-renderer';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { TestStep } from '../../types/test-step';

const contrastDescription: JSX.Element = <span>Text elements must have sufficient contrast.</span>;

const WindowsPlatformLink = () => <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2075365">{windowsPlatformTitle}</NewTabLink>;

const contrastHowToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights instances of text where the contrast ratio can't be determined, typically because the
        background color is not uniform. You must manually verify the contrast for these instances.
        <ol>
            <li>
                Examine each instance in the target page to identify an area where the text and background are most likely to have a low
                contrast ratio (e.g., white text on a light gray background).
            </li>
            <li>
                Use <WindowsPlatformLink /> to test the contrast at that area. (If you are testing on a Mac, you can use the{' '}
                <NewTabLink href="https://developer.paciellogroup.com/resources/contrastanalyser/">Colour Contrast Analyser</NewTabLink>.)
            </li>
            <li>
                Verify that each instance meets these contrast thresholds:
                <ol>
                    <li>
                        Regular text must have a ratio <Markup.GreaterThanOrEqualTo /> 4.5
                    </li>
                    <li>
                        Large text (18pt or 14pt+bold) must have a ratio <Markup.GreaterThanOrEqualTo /> 3.0.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = TextLegibilityTestStep.contrast;

const propertyBagConfig: PropertyBagColumnRendererConfig<ContrastPropertyBag>[] = [
    {
        propertyName: 'textString',
        displayName: 'Text string',
        defaultValue: NoValue,
    },
    {
        propertyName: 'size',
        displayName: 'Size',
    },
];

export const Contrast: TestStep = {
    key: TextLegibilityTestStep.contrast,
    name: 'Contrast',
    description: contrastDescription,
    howToTest: contrastHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_4_3],
    columnsConfig: [
        {
            key: 'contrast-ratio-info',
            name: 'Contrast ratio info',
            onRender: PropertyBagColumnRendererFactory.get(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['text-contrast'],
                key,
                testType: VisualizationType.TextLegibility,
                resultProcessor: (scanner: ScannerUtils) => scanner.getIncompleteInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
