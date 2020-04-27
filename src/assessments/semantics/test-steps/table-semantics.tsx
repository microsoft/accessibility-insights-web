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
    <span>Semantic elements in a data table must not be coded as decorative.</span>
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
                <Markup.Term>Outline > Outline tables</Markup.Term>) to highlight tables on the
                page.
            </li>
            <li>
                Examine the target page to identify any <Markup.Emphasis>data</Markup.Emphasis>{' '}
                tables:
                <ol>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table organizes content into rows
                        and columns to show relationships.
                    </li>
                    <li>
                        A <Markup.Emphasis>layout</Markup.Emphasis> table is used to visually
                        position content without implying any relationships.
                    </li>
                </ol>
            </li>
            <li>
                Use the Web Developer browser extension to reveal elements with ARIA roles (
                <Markup.Term>Information > Display ARIA Roles</Markup.Term>).
            </li>
            <li>
                Verify that each table is coded correctly for its type:
                <ol>
                    <li>
                        A <Markup.Code>&lt;table&gt;</Markup.Code>element that serves as
                        a data table must not be marked with
                        <Markup.Code>role="presentation"</Markup.Code>
                        or <Markup.Code>role="none"</Markup.Code>.
                    </li>
                    <li>
                        A <Markup.Code>&lt;table&gt;</Markup.Code> element that serves as
                        a layout table must be marked with
                        <Markup.Code>role="presentation"</Markup.Code> or
                        <Markup.Code>role="none"</Markup.Code>.
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
