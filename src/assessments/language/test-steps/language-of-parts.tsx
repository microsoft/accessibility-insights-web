// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/language/language-of-parts';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { LanguageAttributeLink } from '../common/language-attribute-link';
import { LanguageTestStep } from './test-steps';

const languageOfPartsDescription: JSX.Element = (
    <span>
        If the language of a passage differs from the default language of the page, the passage must have its own language attribute.
    </span>
);

const languageOfPartsHowToTest: JSX.Element = (
    <div>
        <p>
            <Markup.Emphasis>
                Note: if an element has an invalid <Markup.Term>lang</Markup.Term> attribute, it will fail an automated check
            </Markup.Emphasis>
        </p>
        <ol>
            <li>Examine the target page to identify any passages in a language different from the default language of the page.</li>
            <li>
                If you find such a passage, examine the containing element's HTML to verify that it has the correct{' '}
                <LanguageAttributeLink />.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const LanguageOfParts: Requirement = {
    key: LanguageTestStep.languageOfParts,
    name: 'Language of parts',
    description: languageOfPartsDescription,
    howToTest: languageOfPartsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_3_1_2],
};
