// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/semantics/data-tables';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';
const dataTablesDescription: JSX.Element = (
    <span>
        Semantic elements in a data table must not be coded as decorative.
    </span>
);

const dataTablesHowToTest: JSX.Element = (
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
                <Markup.Term>Outline > Outline tables</Markup.Term>) to
                highlight tables on the page.
            </li>
            <li>
                Examine the target page to identify any{' '}
                <Markup.Emphasis>data</Markup.Emphasis> tables:
                <ol>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table
                        organizes content into rows and columns to show
                        relationships.
                    </li>
                    <li>
                        A <Markup.Emphasis>layout</Markup.Emphasis> table is
                        used to visually position content without implying any
                        relationships.
                    </li>
                </ol>
            </li>
            <li>
                Use the Web Developer browser extension (
                <Markup.Term>Information > Display ARIA Roles</Markup.Term>) to
                verify that none of its elements is coded with{' '}
                <Markup.Term>role="presentation"</Markup.Term>.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const DataTables: Requirement = {
    key: SemanticsTestStep.dataTables,
    name: 'Data tables',
    description: dataTablesDescription,
    howToTest: dataTablesHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
};
