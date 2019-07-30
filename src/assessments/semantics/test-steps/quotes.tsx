// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/semantics/quotes';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const quotesDescription: JSX.Element = (
    <span>
        The <Markup.Tag tagName="blockquote" /> element must not be used to style non-quote text.
    </span>
);

const quotesHowToTest: JSX.Element = (
    <div>
        <p>This procedure uses the browser Developer Tools (F12) to inspect the page's HTML.</p>
        <ol>
            <li>
                Search the page's HTML to determine whether the page includes any <Markup.Tag tagName="blockquote" /> elements.
            </li>
            <li>
                Examine each <Markup.Tag tagName="blockquote" /> element to verify it contains a quote.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const SemanticsQuotes: Requirement = {
    key: SemanticsTestStep.quotes,
    name: 'Quotes',
    description: quotesDescription,
    howToTest: quotesHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
