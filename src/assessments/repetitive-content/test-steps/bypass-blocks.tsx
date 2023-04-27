// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/repetitive-content/bypass-blocks';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { RepetitiveContentTestStep } from './test-steps';

const bypassBlocksDescription: JSX.Element = (
    <span>A page must provide a keyboard-accessible method to bypass repetitive content.</span>
);

const bypassBlocksHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify:
                <ol>
                    <li>The starting point of the page's primary content.</li>
                    <li>
                        Any blocks of content that (1) <Markup.Emphasis>precede</Markup.Emphasis>{' '}
                        the primary content and (2) appear on multiple pages, such as banners,
                        navigation links, and advertising frames.
                    </li>
                </ol>
            </li>
            <li>Refresh the page to ensure that it's in its default state.</li>
            <li>
                Use the <Markup.Term>Tab</Markup.Term> key to navigate toward the primary content.
                As you navigate, look for a bypass mechanism (typically a{' '}
                <NewTabLink href="https://webaim.org/techniques/skipnav/">skip link</NewTabLink>
                ). The mechanism might not become visible until it receives focus.
            </li>
            <li>
                If a bypass mechanism <Markup.Emphasis>does not</Markup.Emphasis> exist, select{' '}
                <Markup.Term>Fail</Markup.Term>, then add the failure instance.
            </li>
            <li>
                If a bypass mechanism <Markup.Emphasis>does</Markup.Emphasis> exist, activate it.
            </li>
            <li>
                Verify that focus shifts past any repetitive content to the page's primary content.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={false} />
        </ol>
    </div>
);

export const BypassBlocks: Requirement = {
    key: RepetitiveContentTestStep.bypassBlocks,
    name: 'Bypass blocks',
    description: bypassBlocksDescription,
    howToTest: bypassBlocksHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_4_1],
};
