// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/repetitive-content/consistent-identification';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { RepetitiveContentTestStep } from './test-steps';

const consistentIdentificationDescription: JSX.Element = (
    <span>Functional components that appear on multiple pages must be identified consistently.</span>
);

const consistentIdentificationHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any functional components (such as links, widgets, icons, images, headings, etc.) that
                appear on multiple pages.
            </li>
            <li>
                Use the{' '}
                <NewTabLink href="https://developers.google.com/web/updates/2018/01/devtools">
                    Accessibility pane in the browser Developer Tools
                </NewTabLink>{' '}
                to verify that the component has the same accessible name each time it appears.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ConsistentIdentification: Requirement = {
    key: RepetitiveContentTestStep.consistentIdentification,
    name: 'Consistent identification',
    description: consistentIdentificationDescription,
    howToTest: consistentIdentificationHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_3_2_4],
    ...content,
};
