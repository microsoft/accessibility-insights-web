// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IImagesOfTextPropertyBag } from '../../../common/types/property-bag/iimage-of-text';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName } from '../../../content/strings/application';
import * as content from '../../../content/test/images/images-of-text';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import { IPropertyBagColumnRendererConfig } from '../../common/property-bag-column-renderer';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import { TestStep } from '../../types/test-step';
import { ReportInstanceField } from '../../types/report-instance-field';
import { ImagesTestStep } from './test-steps';

const description: JSX.Element = <span>Images of text are allowed only where a specific appearance is required (e.g., logotypes).</span>;

const howToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights images that are coded as meaningful.
        <ol>
            <li>In the target page, examine each image to identify any images of text.</li>
            <li>If you find an image of text, verify that it is used only where a specific appearance required, such as text in a logo.</li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = ImagesTestStep.imageOfText;

const propertyBagConfig: IPropertyBagColumnRendererConfig<IImagesOfTextPropertyBag>[] = [
    {
        propertyName: 'imageType',
        displayName: 'Image type',
    },
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: '-',
    },
];

export const ImagesOfText: TestStep = {
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
            onRender: PropertyBagColumnRendererFactory.get(propertyBagConfig),
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
