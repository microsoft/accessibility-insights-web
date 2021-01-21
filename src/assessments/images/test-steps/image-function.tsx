// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ImageFunctionPropertyBag } from 'common/types/property-bag/image-function';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import * as content from 'content/test/images/image-function';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ImagesTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Every image must be coded as either meaningful or decorative.</span>
);

const howToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights images that are coded as meaningful or
        decorative.
        <br />
        <Markup.Emphasis>
            Notes: (1) If an image has no code to identify it as meaningful or decorative, it will
            fail an automated check. (2) Assistive technologies will ignore any image coded as
            decorative, even if it has an accessible name. (3) If no matching/failing instances are
            found, this requirement will automatically be marked as Pass.
        </Markup.Emphasis>
        <ol>
            <li>
                Examine each image to verify that its coded function is correct:
                <ol>
                    <li>
                        An image should be coded as <Markup.Emphasis>meaningful</Markup.Emphasis> if
                        it conveys information that isn't available through other page content.
                    </li>
                    <li>
                        An image should be coded as <Markup.Emphasis>decorative</Markup.Emphasis> if
                        it could be removed from the page with <Markup.Emphasis>no</Markup.Emphasis>{' '}
                        impact on meaning or function.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = ImagesTestStep.imageFunction;

const propertyBagConfig: PropertyBagColumnRendererConfig<ImageFunctionPropertyBag>[] = [
    {
        propertyName: 'imageType',
        displayName: 'Image type',
    },
    {
        propertyName: 'codedAs',
        displayName: 'Coded as',
        defaultValue: NoValue,
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

export const ImageFunction: Requirement = {
    key,
    name: 'Image function',
    description,
    howToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_1_1],
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
                rules: ['image-function'],
                key,
                testType: VisualizationType.ImagesAssessment,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
