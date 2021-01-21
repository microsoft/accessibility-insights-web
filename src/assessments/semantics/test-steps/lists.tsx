// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/semantics/lists';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const listsDescription: JSX.Element = (
    <span>Lists must be contained within semantically correct containers.</span>
);

const listsHowToTest: JSX.Element = (
    <div>
        <p>This procedure uses the browser Developer Tools (F12) to inspect the page's HTML.</p>
        <p>
            <Markup.Emphasis>
                Note: This requirement applies to list containers. An automated check will fail if
                list items are incorrectly coded.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>
                Examine the target page to identify any content that appears to be a list. A list is
                a set of related items displayed consecutively. List items are usually, but not
                always, stacked vertically.
            </li>
            <li>
                Examine the HTML for each list to verify that it is contained within the
                semantically correct element:
                <ol>
                    <li>
                        An <Markup.Emphasis>unordered</Markup.Emphasis> list (plain or bulleted)
                        must be contained within with a <Markup.Tag tagName="ul" /> element.
                    </li>
                    <li>
                        An <Markup.Emphasis>ordered</Markup.Emphasis> list (numbered) must be
                        contained within an <Markup.Tag tagName="ol" /> element.
                    </li>
                    <li>
                        A <Markup.Emphasis>description</Markup.Emphasis> list (a set of terms and
                        definitions) must be contained within a <Markup.Tag tagName="dl" /> element.
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const SemanticsLists: Requirement = {
    key: SemanticsTestStep.lists,
    name: 'Lists',
    description: listsDescription,
    howToTest: listsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_1],
};
