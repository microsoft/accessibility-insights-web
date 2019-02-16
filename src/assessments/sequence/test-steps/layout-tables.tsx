// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from '../../markup';
import * as React from 'react';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { SequenceTestStep } from './test-steps';
import { link } from '../../../content/link';
import { TestStep } from '../../types/test-step';

const description: JSX.Element = <span>The content in an HTML layout table must make sense when the table is linearized.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>
            This procedure uses the Chrome{' '}
            <NewTabLink href="https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm">
                Web Developer
            </NewTabLink>{' '}
            extension.
        </p>
        <ol>
            <li>
                Use the Chrome Web Developer extension (<Markup.Term>Outline > Outline Tables</Markup.Term>) to identify any{' '}
                <Markup.Code>{'<table>'}</Markup.Code> elements in the target page.
            </li>
            <li>
                If you find a table, determine whether it is a <Markup.Emphasis>layout</Markup.Emphasis> table:
                <ol>
                    <li>
                        A <Markup.Emphasis>layout</Markup.Emphasis> table is used to visually position content without implying any
                        relationships
                    </li>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table organizes content into rows and columns to show relationships.
                    </li>
                </ol>
            </li>
            <li>
                If you find a layout table, use the Chrome Web Developer extension (
                <Markup.Term>Miscellaneous > Linearize Page</Markup.Term>) to show the page in DOM order.
            </li>
            <li>Verify that content in layout tables still has the correct reading order when the page is linearized.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const LayoutTables: TestStep = {
    key: SequenceTestStep.layoutTables,
    name: 'Layout tables',
    description: description,
    howToTest: howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_2],
};
