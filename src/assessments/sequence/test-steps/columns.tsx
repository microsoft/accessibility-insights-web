// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/sequence/columns';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SequenceTestStep } from './test-steps';

const description: JSX.Element = <span>White space characters must not be used to create the appearance of columns.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>This procedure uses the browser Developer Tools (F12) to inspect the page's HTML.</p>
        <ol>
            <li>
                Search the page's HTML to determine whether the page includes any <Markup.Tag tagName="pre" /> elements.
            </li>
            <li>
                Examine each <Markup.Tag tagName="pre" /> element to verify that white space characters are not used to arrange the text
                into a column. White space characters include spaces, tabs, line breaks, and carriage returns.
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
