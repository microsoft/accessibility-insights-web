// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/semantics/table-headers';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const headersDescription: JSX.Element = <span>Coded headers must be used correctly.</span>;

const headersHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights elements that are coded as table
            headers. Coded headers include <Markup.Tag tagName="th" /> elements and any element with
            a <Markup.CodeTerm>role</Markup.CodeTerm> attribute set to "
            <Markup.CodeTerm>columnheader</Markup.CodeTerm>" or "
            <Markup.CodeTerm>rowheader</Markup.CodeTerm>".
        </p>
        <ol>
            <li>
                Examine the target page to identify any <Markup.Emphasis>data</Markup.Emphasis>{' '}
                tables:
                <ol>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table uses rows and columns to
                        show relationships within a set of data.
                    </li>
                    <li>
                        A <Markup.Emphasis>layout</Markup.Emphasis> table uses rows and columns to
                        visually position content without implying any relationships.
                    </li>
                </ol>
            </li>
            <li>
                Examine each data table to identify cells that function as headers:
                <ol>
                    <li>
                        A cell functions as a header if it provides a label for one or more rows or
                        columns of data.
                    </li>
                    <li>A cell does not function as a header if it serves any other purpose.</li>
                </ol>
            </li>
            <li>
                Verify that coded headers are used correctly:
                <ol>
                    <li>
                        Cells that function as headers <Markup.Emphasis>must be</Markup.Emphasis>{' '}
                        coded as headers, and
                    </li>
                    <li>
                        Cells that do not function as headers{' '}
                        <Markup.Emphasis>must not be</Markup.Emphasis> coded as headers.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const key = SemanticsTestStep.headers;

export const TableHeaders: Requirement = {
    key,
    name: 'Table headers',
    description: headersDescription,
    howToTest: headersHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    ...content,
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['collect-headers'],
                ...analyzerConfig,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
