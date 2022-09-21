// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import * as content from 'content/test/page/frame-titles';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { Tag, Term } from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { frameTitleInstanceDetailsColumnRenderer } from '../frametitle-instance-details-column-renderer';
import { PageTestStep } from './test-steps';

const frameTitleDescription: JSX.Element = (
    <span>A frame or iframe must have a title that describes its content.</span>
);

const frameTitleHowToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, {productName} highlights all{' '}
            <Tag tagName="frame" isBold={false} /> and
            <Tag tagName="iframe" isBold={false} /> elements with visible content.
        </p>
        <p>
            <Markup.Emphasis>
                Notes: (1) If no matching/failing instances are found, this requirement will
                automatically be marked as pass. (2) If a frame or iframe doesn't have a title, it
                will fail an automated check and will not be displayed in the list of instances for
                this requirement.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>
                Examine each <Tag tagName="frame" isBold={false} /> or{' '}
                <Tag tagName="iframe" isBold={false} />
                in the <Term>Instances</Term> list below to verify that that its title describes its
                content.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const FrameTitle: Requirement = {
    key: PageTestStep.frameTitle,
    name: 'Frame title',
    description: frameTitleDescription,
    howToTest: frameTitleHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_4_1_2],
    columnsConfig: [
        {
            key: 'page-frames',
            name: 'Frame Title',
            onRender: frameTitleInstanceDetailsColumnRenderer,
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagField<FrameAssessmentProperties>(
            'Frame title',
            'frameTitle',
        ),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['get-frame-title'],
                key: PageTestStep.frameTitle,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
                testType: VisualizationType.PageAssessment,
            }),
        ),
    getDrawer: provider => provider.createFrameDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
