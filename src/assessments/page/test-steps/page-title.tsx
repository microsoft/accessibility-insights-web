// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PageAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/page/page-title';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { Term } from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { pageTitleInstanceDetailsColumnRenderer } from '../pagetitle-instance-details-column-renderer';
import { PageTestStep } from './test-steps';

const pageTitleDescription: JSX.Element = (
    <span>A web page must have a title that describes its topic or purpose.</span>
);

const pageTitleHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Consider the title of the target page, displayed in the <Term>Instances</Term> list
                below.
            </li>
            <li>
                Verify that the page's title describes its topic or purpose:
                <ol>
                    <li>For pages within a website, the page title must be unique.</li>
                    <li>
                        For documents or single-page web apps, the document name or app name is
                        sufficient.
                    </li>
                </ol>
            </li>
            <li>
                Record your results:
                <ol>
                    <li>
                        Select <Term>Fail</Term> if the page title does not meet the requirement.
                    </li>
                    <li>
                        Otherwise, select <Term>Pass</Term>.
                    </li>
                </ol>
            </li>
        </ol>
    </div>
);

export const PageTitle: Requirement = {
    key: PageTestStep.pageTitle,
    name: 'Page title',
    description: pageTitleDescription,
    howToTest: pageTitleHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_2_4_2],
    columnsConfig: [
        {
            key: 'page-title-text',
            name: 'Page Title',
            onRender: pageTitleInstanceDetailsColumnRenderer,
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagField<PageAssessmentProperties>(
            'Page title',
            'pageTitle',
        ),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['page-title'],
                key: PageTestStep.pageTitle,
                testType: VisualizationType.PageAssessment,
            }),
        ),
};
