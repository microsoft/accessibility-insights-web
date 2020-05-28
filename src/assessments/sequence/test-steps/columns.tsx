// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/sequence/columns';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SequenceTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Content presented in multi-column format must support a correct reading sequence.</span>
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
                Use the Web Developer browser extension (<Markup.Term>Outline</Markup.Term> {'>'}{' '}
                <Markup.Term>Outline table cells</Markup.Term>) to highlight table cells (
                <Markup.Tag tagName="td" /> and <Markup.Tag tagName="th" /> elements).
            </li>
            <li>
                Examine the page to identify any side-by-side columns of text or data that are{' '}
                <Markup.Emphasis>not</Markup.Emphasis> contained in a table cell.
            </li>
            <li>
                Using your mouse or keyboard, verify that you can select{' '}
                <Markup.Emphasis>all</Markup.Emphasis> of the text in one column without selecting{' '}
                <Markup.Emphasis>any</Markup.Emphasis> text from an adjacent column.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Columns: Requirement = {
    key: SequenceTestStep.columns,
    name: 'Columns',
    description: description,
    howToTest: howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_1_3_2],
};
