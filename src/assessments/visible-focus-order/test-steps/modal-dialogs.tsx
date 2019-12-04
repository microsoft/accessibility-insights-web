// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/focus/modal-dialogs';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Users must not be able to Tab away from a modal dialog without explicitly dismissing it.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any "trigger" components that open modal
                dialogs.
            </li>
            <li>Use the keyboard to activate each trigger component.</li>
            <li>
                Use the <Markup.Term>Tab</Markup.Term> and arrow keys as needed to move focus all
                the way through the content of the dialog.
            </li>
            <li>
                Verify that you cannot move focus out of any modal dialog using just the{' '}
                <Markup.Term>Tab</Markup.Term> or arrow keys.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ModalDialogs: Requirement = {
    key: visibleFfocusOrderTestStep.modalDialogs,
    name: 'Modal dialogs',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_3],
    ...content,
};
