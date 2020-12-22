// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PropertyBagColumnRendererFactory } from 'assessments/common/property-bag-column-renderer-factory';
import {
    MacContrastCheckerAppLink,
    WindowsContrastCheckerAppLink,
} from 'common/components/contrast-checker-app-links';
import { ContrastPropertyBag } from 'common/types/property-bag/contrast';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import * as content from 'content/test/adaptable-content/contrast';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { AdaptableContentTestStep } from './test-step';

const contrastDescription: JSX.Element = <span>Text elements must have sufficient contrast.</span>;

const contrastHowToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, {productName} highlights instances of text where the contrast
            ratio can't be determined, typically because the background color is not uniform. You
            must manually verify the contrast for these instances.
        </p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                Examine each instance in the target page to determine whether it is text. (Because
                icons are assessed in
                <Markup.Term> Contrast {'>'} Graphics </Markup.Term>, they can be marked as{' '}
                <Markup.Term> Pass </Markup.Term> in this test.)
            </li>
            <li>
                Examine each text instance to identify an area where the text and background are
                most likely to have a low contrast ratio (e.g., white text on a light gray
                background).
            </li>
            <li>
                Use <WindowsContrastCheckerAppLink /> to test the contrast at that area. (If you are
                testing on a Mac, you can use the <MacContrastCheckerAppLink />
                .)
            </li>
            <li>
                Verify that each instance meets these contrast thresholds:
                <ol>
                    <li>
                        Regular text must have a ratio <Markup.GreaterThanOrEqualTo /> 4.5
                    </li>
                    <li>
                        Large text (18pt or 14pt+bold) must have a ratio{' '}
                        <Markup.GreaterThanOrEqualTo /> 3.0.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = AdaptableContentTestStep.contrast;

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

export const Contrast: Requirement = {
    key: AdaptableContentTestStep.contrast,
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
            onRender: PropertyBagColumnRendererFactory.getRenderer(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['text-contrast'],
                key,
                testType: VisualizationType.AdaptableContent,
                resultProcessor: (scanner: ScannerUtils) => scanner.getIncompleteInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
