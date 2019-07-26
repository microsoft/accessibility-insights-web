// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import * as content from '../../../content/test/errors/status-messages';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ErrorsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>If an input error is automatically detected, the item in error must be identified, and the error described, in text.</span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether it generates any status messages. A status message provides information to the
                user on any of the following:
                <ol>
                    <li>The success or results of an action</li>
                    <li>The waiting state of an application</li>
                    <li>The progress of a process</li>
                    <li>The existence of errors</li>
                </ol>
            </li>
            <li>Refresh the page.</li>
            <li>
                Inspect the page's HTML to identify an empty container with one of the following attributes:
                <ol>
                    <li>role="alert"</li>
                    <li>role="log"</li>
                    <li>role="progressbar"</li>
                    <li>aria-live="assertive" </li>
                </ol>
            </li>
            <li>Trigger the action that generates the status message.</li>
            <li>Verify that the status message is injected into the container.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const StatusMessages: Requirement = {
    key: ErrorsTestStep.statusMessages,
    name: 'Status messages',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_4_1_3],
};
