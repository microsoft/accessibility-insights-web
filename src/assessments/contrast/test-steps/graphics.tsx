// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MacContrastCheckerAppLink, WindowsContrastCheckerAppLink } from 'common/components/contrast-checker-app-links';
import { ImagesOfTextPropertyBag } from 'common/types/property-bag/image-of-text';
import { link } from 'content/link';
import * as content from 'content/test/contrast/ui-components';
import * as React from 'react';

import { VisualizationType } from '../../../common/types/visualization-type';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { NoValue, PropertyBagColumnRendererConfig } from '../../common/property-bag-column-renderer';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ContrastTestStep } from './test-steps';

const description: JSX.Element = <span>Graphics must have sufficient contrast.</span>;

const howToTest: JSX.Element = (
    <div>
        Use Accessibility Insights for Windows to verify that each necessary part has a contrast ratio of at least 3:1 against the adjacent
        background. Exception: A lower contrast ratio is allowed for logos, photos, and other cases where a specific visual presentation is
        essential.
        <p>The visual helper for this requirement highlights images coded as meaningful.</p>
        <ol>
            <li>
                In the target page, examine each highlighted image to identify any of the following graphics:
                <ol>
                    <li>Stand-alone icons (no text)</li>
                    <li>Charts</li>
                    <li>Diagrams</li>
                    <li>Illustrations</li>
                </ol>
            </li>
            <li>For each graphic, identify the parts that are necessary for the graphic to be understood. (This is subjective.)</li>
            <li>
                <p>
                    Use <WindowsContrastCheckerAppLink /> to verify that each necessary part has a contrast ratio of at least 3:1 against
                    the adjacent background. (If you are testing on a Mac, you can use the <MacContrastCheckerAppLink />
                    .)
                </p>
                <p>
                    Exception: A lower contrast ratio is allowed for logos, photos, and other cases where a specific visual presentation is
                    essential.
                </p>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<ImagesOfTextPropertyBag>[] = [
    {
        propertyName: 'imageType',
        displayName: 'Image type',
    },
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
];

export const TextAlternative: Requirement = {
    key: ContrastTestStep.graphics,
    name: 'Graphics',
    description,
    howToTest,
    ...content,
    guidanceLinks: [link.WCAG_1_4_11],
    isManual: false,
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
                key: ContrastTestStep.graphics,
                testType: VisualizationType.ContrastAssessment,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
