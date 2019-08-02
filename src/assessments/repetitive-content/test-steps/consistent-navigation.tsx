// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/repetitive-content/consistent-navigation';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { RepetitiveContentTestStep } from './test-steps';

const consistentNavigationDescription: JSX.Element = (
    <span>Navigational mechanisms that appear on multiple pages must be presented in the same relative order.</span>
);

const consistentNavigationHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any navigational mechanisms (such as site navigation bars, search fields, and skip
                links) that appear on multiple pages.
            </li>
            <li>
                Verify that the links or buttons in each navigational mechanism are presented in the same relative order each time they
                appear. (Items should be in the same relative order even if other items are inserted or removed between them.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ConsistentNavigation: Requirement = {
    key: RepetitiveContentTestStep.consistentNavigation,
    name: 'Consistent navigation',
    description: consistentNavigationDescription,
    howToTest: consistentNavigationHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_3_2_3],
    ...content,
};
