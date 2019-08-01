// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/language/text-direction';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LanguageTestStep } from './test-steps';

const textDirectionDescription: JSX.Element = (
    <span>If a page or a passage uses a script that is read right-to-left, it must have the correct text direction.</span>
);

const textDirectionHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether the page uses a{' '}
                <NewTabLink href="https://www.w3.org/International/questions/qa-scripts">right-to-left script</NewTabLink> - such as Arabic,
                Hebrew, Persian or Urdu.
            </li>
            <li>
                If the page or a passage <Markup.Emphasis>does</Markup.Emphasis> use a right-to-left script, examine the containing
                element's HTML to verify that it has the correct direction attribute (<Markup.Term>dir="rtl"</Markup.Term>).
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TextDirection: Requirement = {
    key: LanguageTestStep.textDirection,
    name: 'Text direction',
    description: textDirectionDescription,
    howToTest: textDirectionHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_2],
};
