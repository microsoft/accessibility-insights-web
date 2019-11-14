// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/language/language-of-page';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LanguageAttributeLink } from '../common/language-attribute-link';
import { LanguageTestStep } from './test-steps';

const languageOfTextDescription: JSX.Element = (
    <span>A page must have the correct default language.</span>
);

const languageOfTextHowToTest: JSX.Element = (
    <div>
        <p>
            <Markup.Emphasis>
                Note: If the <Markup.Tag tagName="html" /> element's{' '}
                <Markup.Term>lang</Markup.Term> attribute is missing or invalid,
                it will fail an automated check.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>Examine the target page to determine its primary language.</li>
            <li>
                Inspect the page's <Markup.Tag tagName="html" /> tag to verify
                that it has the correct <LanguageAttributeLink />.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={false} />
        </ol>
    </div>
);

export const LanguageOfPage: Requirement = {
    key: LanguageTestStep.languageOfPage,
    name: 'Language of page',
    description: languageOfTextDescription,
    howToTest: languageOfTextHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_1_1],
};
