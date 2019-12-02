// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { TextAlternativePropertyBag } from 'common/types/property-bag/itext-alternative';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/images/text-alternative';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from '../../common/property-bag-column-renderer';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ImagesTestStep } from './test-steps';

const description: JSX.Element = (
    <span>A meaningful image must have a text alternative that serves the equivalent purpose.</span>
);

const howToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights images that are coded as meaningful.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                Examine each image in the <Markup.Term>Instances</Markup.Term> list to verify that
                its text alternative serves the equivalent purpose.
                <ol>
                    <li>
                        A <Markup.Emphasis>simple</Markup.Emphasis> image should have an accessible
                        name that serves the equivalent purpose. Special cases:
                        <ol>
                            <li>
                                An image of text should have an accessible name that exactly matches
                                the text within the image.
                            </li>
                            <li>
                                A CAPTCHA image should have an accessible name that communicates the
                                purpose of the image, but not its content. (A CAPTCHA is a test to
                                differentiate a human from a computer.)
                            </li>
                        </ol>
                    </li>
                    <li>
                        A <Markup.Emphasis>complex</Markup.Emphasis> image (such as a graph) should
                        have both
                        <ol>
                            <li>
                                An accessible name that communicates the purpose of the image, and
                            </li>
                            <li>
                                An accessible description that communicates the content of the
                                image.
                            </li>
                        </ol>
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = ImagesTestStep.textAlternative;

const propertyBagConfig: PropertyBagColumnRendererConfig<TextAlternativePropertyBag>[] = [
    {
        propertyName: 'imageType',
        displayName: 'Image type',
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

export const TextAlternative: Requirement = {
    key: ImagesTestStep.textAlternative,
    name: 'Text alternative',
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
                rules: ['accessible-image'],
                key,
                testType: VisualizationType.ImagesAssessment,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
