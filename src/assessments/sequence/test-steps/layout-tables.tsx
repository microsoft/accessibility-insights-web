// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/sequence/layout-tables';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SequenceTestStep } from './test-steps';

const description: JSX.Element = (
    <span>The content in an HTML layout table must make sense when the table is linearized.</span>
);

const howToTest: JSX.Element = (
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
                Use the Web Developer extension (
                <Markup.Term>Outline {'>'} Outline Tables</Markup.Term>
                ) to identify any <Markup.Tag tagName="table" /> elements in the target page.
            </li>
            <li>
                If you find a table, determine whether it is a{' '}
                <Markup.Emphasis>layout</Markup.Emphasis> table:
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
                If you find a layout table, use the Web Developer browser extension (
                <Markup.Term>Miscellaneous {'>'} Linearize page</Markup.Term>) to show the page in
                DOM order.
            </li>
            <li>
                Verify that content in layout tables still has the correct reading order when the
                page is linearized.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const LayoutTables: Requirement = {
    key: SequenceTestStep.layoutTables,
    name: 'Layout tables',
    description: description,
    howToTest: howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_2],
};
