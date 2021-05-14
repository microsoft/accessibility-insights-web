// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LinkFunctionPropertyBag } from 'common/types/property-bag/link-function-property-bag';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { title } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/links/link-function';
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
import { LinksTestStep } from './test-steps';

const LinkFunctionDescription: JSX.Element = (
    <span>
        If an anchor element functions as a custom widget, it must have the appropriate ARIA widget
        role.
    </span>
);

const LinkFunctionHowToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, {title} highlights anchor elements that are possible custom
            widgets. These elements don't have an ARIA widget role, but they do have some custom
            widget markup, such as <Markup.Term>tabindex="-1"</Markup.Term>, an ARIA attribute, a
            non-widget role, or no <Markup.Term>href</Markup.Term>.
        </p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, examine each highlighted anchor element to verify that it
                functions as a link (i.e., it navigates to new content in the current page or in a
                new page).
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<LinkFunctionPropertyBag>[] = [
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
    {
        propertyName: 'url',
        displayName: 'URL',
        defaultValue: NoValue,
    },
    {
        propertyName: 'role',
        displayName: 'Role',
        defaultValue: NoValue,
    },
    {
        propertyName: 'tabIndex',
        displayName: 'Tab Index',
        defaultValue: NoValue,
    },
    {
        propertyName: 'ariaAttributes',
        displayName: 'Aria attributes',
        defaultValue: NoValue,
        expand: true,
    },
];

export const LinkFunction: Requirement = {
    key: LinksTestStep.linkFunction,
    name: 'Link function',
    description: LinkFunctionDescription,
    howToTest: LinkFunctionHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_4_1_2],
    columnsConfig: [
        {
            key: 'link-function-info',
            name: 'Link info',
            onRender:
                PropertyBagColumnRendererFactory.getRenderer<LinkFunctionPropertyBag>(
                    propertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['link-function'],
                key: LinksTestStep.linkFunction,
                testType: VisualizationType.LinksAssessment,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
