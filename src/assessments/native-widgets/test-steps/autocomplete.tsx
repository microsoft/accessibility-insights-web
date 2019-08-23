// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as React from 'react';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { NativeWidgetsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Text fields that serve certain purposes must have the correct HTML5 <Markup.Term>autocomplete</Markup.Term> attribute.
    </span>
);
const howToTest: JSX.Element = (
    <div>
        The visual helper for this requirement highlights text fields.
        <ol>
            <li>In the target page, examine each highlighted text field to determine whether it serves an identified input purpose.</li>

            <li>
                If a text field does serve an <NewTabLink href="https://aka.ms/keros/inputpurpose">identified input purpose</NewTabLink>,
                verify that it has an <Markup.Term>autocomplete</Markup.Term> attribute with the correct value.
            </li>

            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const Autocomplete: Requirement = {
    key: NativeWidgetsTestStep.autocomplete,
    name: 'Autocomplete',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_5],
};
