// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/parsing/parsing';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ParsingTestStep } from './test-steps';

const keyboardBookmarkletInstructionsURL =
    '/insights.html#/content/test/parsing/keyboardBookmarkletInstructions';

const description: JSX.Element = (
    <span>
        Elements must have complete start and end tags, must not contain duplicate attributes, and
        must be nested according to their specifications.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            This test uses the{' '}
            <NewTabLink href="https://validator.w3.org/nu/">Nu HTML Checker</NewTabLink> and
            supporting bookmarklets.
        </p>
        <ol>
            <li>
                Open{' '}
                <NewTabLink href="https://validator.w3.org/nu/about.html">
                    About the Nu HTML Checker
                </NewTabLink>{' '}
                in a new browser window.
            </li>
            <li>
                Add these two bookmarklets to your browser bookmarks:
                <ol>
                    <li>Check serialized DOM of current page</li>
                    <li>Check for WCAG 2.0 parsing compliance</li>
                </ol>
                <p>
                    (Mouse users can simply drag the corresponding links from the page to the
                    browser bookmarks bar. Keyboard users can follow{' '}
                    <NewTabLink href={keyboardBookmarkletInstructionsURL}>
                        these instructions
                    </NewTabLink>
                    .)
                </p>
            </li>
            <li>
                Go to the browser tab containing your target page and, in that browser window,
                select the first bookmarklet. It will send the page's DOM to the checker and show
                the results in a new browser tab.
            </li>
            <li>
                Go to the browser tab containing the checker results and, in that browser window,
                select the second bookmarklet. It will filter the results to show only WCAG parsing
                errors.
            </li>
            <li>
                Examine the filtered results to verify that there are no errors related to:
                <ol>
                    <li>Missing start or end tags</li>
                    <li>Duplicate attributes</li>
                    <li>Improper nesting of elements</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Parsing: Requirement = {
    key: ParsingTestStep.parsing,
    name: 'Parsing',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_4_1_1],
};
