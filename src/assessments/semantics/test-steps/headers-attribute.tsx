// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AnalyzerConfigurationFactory } from 'assessments/common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from 'assessments/common/assisted-test-record-your-results';
import { onRenderSnippetColumn } from 'assessments/common/element-column-renderers';
import { link } from 'content/link';
import * as content from 'content/test/semantics/headers-attribute';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import * as React from 'react';

import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const headersAttributeDescription: JSX.Element = (
    <span>
        The <Markup.CodeTerm>headers</Markup.CodeTerm> attribute of a <Markup.Tag tagName="td" />{' '}
        element must reference the correct <Markup.Tag tagName="th" /> element(s).
    </span>
);

const headersAttributeHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights <Markup.Tag tagName="td" /> and{' '}
            <Markup.Tag tagName="th" /> elements with a <Markup.CodeTerm>headers</Markup.CodeTerm>{' '}
            attribute set. Any element whose id is referenced by a{' '}
            <Markup.CodeTerm>headers</Markup.CodeTerm> attribute is also highlighted.
        </p>
        <ol>
            <li>
                Use the visual helper to reveal any <Markup.CodeTerm>headers</Markup.CodeTerm>{' '}
                attributes on the page.
            </li>

            <li>
                If a table has <Markup.CodeTerm>headers</Markup.CodeTerm> attributes, inspect the
                page's HTML to verify that the header and data cells are coded correctly:
                <ol>
                    <li>
                        Each header cell (<Markup.Tag tagName="th" /> element) must have an{' '}
                        <Markup.CodeTerm>id</Markup.CodeTerm> attribute.
                    </li>
                    <li>
                        Each data cell (<Markup.Tag tagName="td" /> element) must have a{' '}
                        <Markup.CodeTerm>headers</Markup.CodeTerm> attribute.
                    </li>
                    <li>
                        Each data cell's <Markup.CodeTerm>headers</Markup.CodeTerm> attribute must
                        reference all cells that function as headers for that data cell.
                    </li>
                </ol>
                <Markup.Emphasis>
                    Note: If a <Markup.CodeTerm>headers</Markup.CodeTerm> attribute references an
                    element that is missing or invalid, it will fail an automated check.
                </Markup.Emphasis>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const key = SemanticsTestStep.headersAttribute;

export const HeadersAttribute: Requirement = {
    key,
    name: 'Headers attribute',
    description: headersAttributeDescription,
    howToTest: headersAttributeHowToTest,
    isManual: false,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['headers-attribute'],
                ...analyzerConfig,
            }),
        ),
    getDrawer: provider => provider.createTableHeaderAttributeDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    columnsConfig: [
        {
            key: 'element',
            name: 'Element',
            onRender: onRenderSnippetColumn,
        },
    ],
};
