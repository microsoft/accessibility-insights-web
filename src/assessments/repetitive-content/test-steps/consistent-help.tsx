// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/repetitive-content/consistent-help';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { RepetitiveContentTestStep } from './test-steps';

const consistentHelpDescription: JSX.Element = (
    <span>
        Ensure help – or mechanism(s) to request help – are consistently located in the same
        relative location across a{' '}
        <NewTabLink href="https://w3c.github.io/wcag/guidelines/#dfn-set-of-web-pages">
            set of web pages/screens
        </NewTabLink>
        .
    </span>
);

const consistentHelpHowToTest: JSX.Element = (
    <div>
        <p>
            <Markup.Emphasis>
                Note: this criterion does not require help to be provided.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>
                <p>
                    Examine the target page to identify "help" mechanisms (for example links to
                    help, etc.) on the page. Determine if this is a set of web pages with blocks of
                    content that are repeated on multiple pages.
                </p>
            </li>
            <li>
                <p>
                    Verify that all helpful information and mechanisms provided are consistent with
                    other pages in terms of location, behavior and relative to the other content of
                    the page &amp; UI for all components where help resides.
                </p>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
        <p>
            <Markup.Emphasis>
                Exception: The location of a help mechanism can change based on user input, for
                example resizing of the window that changes the location of the help link - this
                would still pass this rule so long as the help link was consistently presented in
                the same location across the same set of web pages at the adjusted window size.
            </Markup.Emphasis>
        </p>
    </div>
);

export const ConsistentHelp: Requirement = {
    key: RepetitiveContentTestStep.consistentHelp,
    name: 'Consistent help',
    description: consistentHelpDescription,
    howToTest: consistentHelpHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_3_2_6],
    ...content,
};
