// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LinkPurposePropertyBag } from 'common/types/property-bag/link-purpose-property-bag';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { title } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/links/link-purpose';
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

const LinkPurposeDescription: JSX.Element = (
    <span>
        The purpose of a link must be described by its link text alone, or by the link text together
        with preceding page context.
    </span>
);

const LinkPurposeHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {title} highlights links in the target page.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the <Markup.Term>Instances</Markup.Term> list below, examine each link to verify
                that its accessible name describes its purpose.
                <ol>
                    <li>
                        If a link navigates to a document or web page, the name of the document or
                        page is sufficient.
                    </li>
                    <li>Links with different destinations should have different link text.</li>
                    <li>Links with the same destination should have the same link text.</li>
                </ol>
            </li>
            <li>
                If a link's purpose is clear from its accessible name, mark it as{' '}
                <Markup.Term>Pass</Markup.Term>.
            </li>
            <li>
                If a link's purpose is <Markup.Emphasis>not</Markup.Emphasis> clear from its
                accessible name, examine the link in the context of the target page to verify that
                its purpose is described by the link together with its preceding page context, which
                includes:
                <ol>
                    <li>
                        Text in the same sentence, paragraph, list item, or table cell as the link
                    </li>
                    <li>Text in a parent list item</li>
                    <li>
                        Text in the table header cell that's associated with cell that contains the
                        link
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<LinkPurposePropertyBag>[] = [
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
    {
        propertyName: 'url',
        displayName: 'URL',
        defaultValue: NoValue,
    },
];

export const LinkPurpose: Requirement = {
    key: LinksTestStep.linkPurpose,
    name: 'Link purpose',
    description: LinkPurposeDescription,
    howToTest: LinkPurposeHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_2_4_4],
    columnsConfig: [
        {
            key: 'link-info',
            name: 'Link info',
            onRender: PropertyBagColumnRendererFactory.getRenderer(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['link-purpose'],
                key: LinksTestStep.linkPurpose,
                testType: VisualizationType.LinksAssessment,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
