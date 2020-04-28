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
        A <Markup.Term>headers</Markup.Term> attribute must reference the correct{' '}
        <Markup.CodeTerm>{`<th>`}</Markup.CodeTerm> element(s).{' '}
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
                <Markup.Term>headers</Markup.Term> attributes on the page. Note: The{' '}
                <Markup.Term>headers</Markup.Term> attributes are displayed on the data cells, and
                not on the <Markup.CodeTerm>{`<th>`}</Markup.CodeTerm> cells they reference.
            </li>

            <li>
                If a table has <Markup.Term>headers</Markup.Term> attributes, inspect the HTML to
                verify that they are coded correctly:
                <ol>
                    <li>
                        Each header cell (<Markup.CodeTerm>{`<th>`}</Markup.CodeTerm> element(s))
                        must have an <Markup.Term>id</Markup.Term> attribute.
                    </li>
                    <li>
                        Each data cell's <Markup.Term>headers</Markup.Term> attribute must reference
                        all cells that function as headers for that data cell.
                    </li>
                </ol>
                Note: If a <Markup.Term>headers</Markup.Term> attribute references an element that
                is missing or invalid, it will fail an automated check.
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
