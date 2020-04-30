// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/semantics/headers-attribute';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const headersAttributeDescription: JSX.Element = (
    <span>
        A <Markup.CodeTerm>headers</Markup.CodeTerm> attribute of a <Markup.Tag tagName="td" />{' '}
        element must reference the correct <Markup.Tag tagName="th" /> element(s).
    </span>
);

const headersAttributeHowToTest: JSX.Element = (
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
                <Markup.Term>Information > Display table information</Markup.Term>) to reveal any{' '}
                <Markup.CodeTerm>headers</Markup.CodeTerm> attributes on the page. Note: The{' '}
                <Markup.CodeTerm>headers</Markup.CodeTerm> attributes are displayed on the data
                cells, and not on the <Markup.Tag tagName="th" /> cells they reference.
            </li>

            <li>
                If a table has <Markup.CodeTerm>headers</Markup.CodeTerm> attributes, inspect the
                HTML to verify that they are coded correctly:
                <ol>
                    <li>
                        Each header cell (<Markup.Tag tagName="th" /> element(s)) must have an{' '}
                        <Markup.Code>id</Markup.Code> attribute.
                    </li>
                    <li>
                        Each data cell's <Markup.CodeTerm>headers</Markup.CodeTerm> attribute must
                        reference all cells that function as headers for that data cell.
                    </li>
                </ol>
                Note: If a <Markup.CodeTerm>headers</Markup.CodeTerm> attribute references an
                element that is missing or invalid, it will fail an automated check.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const HeadersAttribute: Requirement = {
    key: SemanticsTestStep.headersAttribute,
    name: 'Headers attribute',
    description: headersAttributeDescription,
    howToTest: headersAttributeHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
};
