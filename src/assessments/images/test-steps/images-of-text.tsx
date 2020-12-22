// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MeaningfulImagePropertyBag } from 'common/types/property-bag/meaningful-image';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/images/images-of-text';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ImagesTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Images of text are allowed only where a specific appearance is required (e.g., logotypes).
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights images that are coded as meaningful.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>In the target page, examine each image to identify any images of text.</li>
            <li>
                If you find an image of text, verify that it is used only where a specific
                appearance required, such as text in a logo.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = ImagesTestStep.imageOfText;

const propertyBagConfig: PropertyBagColumnRendererConfig<MeaningfulImagePropertyBag>[] = [
    {
        propertyName: 'imageType',
        displayName: 'Image type',
    },
    {
        propertyName: 'ariaRole',
        displayName: 'ARIA role',
        defaultValue: NoValue,
    },
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
];

export const ImagesOfText: Requirement = {
    key,
    name: 'Images of text',
    description,
    howToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_4_5],
    columnsConfig: [
        {
            key: 'image-info',
            name: 'Image info',
            onRender: PropertyBagColumnRendererFactory.getRenderer(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['accessible-image'],
                key,
                testType: VisualizationType.ImagesAssessment,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
