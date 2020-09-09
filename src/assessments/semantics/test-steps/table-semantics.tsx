// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/semantics/table-semantics';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const tableSemanticsDescription: JSX.Element = (
    <span>
        A <Markup.Tag tagName="table" /> element must be coded correctly as a{' '}
        <Markup.Emphasis>data</Markup.Emphasis> table or a <Markup.Emphasis>layout</Markup.Emphasis>{' '}
        table.
    </span>
);

const tableSemanticsHowToTest: JSX.Element = (
    <div>
        <p>
            This procedure uses the{' '}
            <NewTabLink href="https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm">
                Web Developer
            </NewTabLink>{' '}
            browser extension.
        </p>
        <ol>
            <li>
                Use the Web Developer browser extension (
                <Markup.Term>Outline {'>'} Outline tables</Markup.Term>) to outline{' '}
                <Markup.Tag tagName="table" /> elements on the page.
            </li>
            <li>
                Examine each outlined table to determine its type:
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
                Use the Web Developer browser extension to reveal elements with ARIA roles (
                <Markup.Term>Information {'>'} Display ARIA Roles</Markup.Term>).
            </li>
            <li>
                Verify that each table is coded correctly for its type:
                <ol>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table{' '}
                        <Markup.Emphasis>must not have</Markup.Emphasis>{' '}
                        <Markup.CodeTerm>role="presentation"</Markup.CodeTerm> or{' '}
                        <Markup.CodeTerm>role="none"</Markup.CodeTerm> on any of its semantic
                        elements:
                        <ul>
                            <li>
                                <Markup.Tag tagName="table" />
                            </li>
                            <li>
                                <Markup.Tag tagName="tr" />
                            </li>
                            <li>
                                <Markup.Tag tagName="th" />
                            </li>
                            <li>
                                <Markup.Tag tagName="td" />
                            </li>
                            <li>
                                <Markup.Tag tagName="caption" />
                            </li>
                            <li>
                                <Markup.Tag tagName="col" />
                            </li>
                            <li>
                                <Markup.Tag tagName="colgroup" />
                            </li>
                            <li>
                                <Markup.Tag tagName="thead" />
                            </li>
                            <li>
                                <Markup.Tag tagName="tfoot" />
                            </li>
                            <li>
                                <Markup.Tag tagName="tbody" />
                            </li>
                        </ul>
                    </li>
                    <li>
                        The <Markup.Tag tagName="table" /> element of a{' '}
                        <Markup.Emphasis>layout</Markup.Emphasis> table{' '}
                        <Markup.Emphasis>must have</Markup.Emphasis>{' '}
                        <Markup.CodeTerm>role="presentation"</Markup.CodeTerm> or{' '}
                        <Markup.CodeTerm>role="none"</Markup.CodeTerm>.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TableSemantics: Requirement = {
    key: SemanticsTestStep.tableSemantics,
    name: 'Table semantics',
    description: tableSemanticsDescription,
    howToTest: tableSemanticsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
};
