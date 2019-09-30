// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/pointer-cancellation';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = <span>Users must be able to cancel functions that can be operated using a single pointer.</span>;

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any functions that can be operated using a{' '}
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#dfn-single-pointer">single pointer</NewTabLink>.
            </li>
            <li>
                Verify that at least one of the following is true:
                <ol>
                    <li>
                        <Markup.Term>No down-event.</Markup.Term> The down-event of the pointer is not used to execute any part of the
                        function.
                    </li>
                    <li>
                        <Markup.Term>Abort or Undo.</Markup.Term> Completion of the function is on the up-event, and a mechanism is
                        available to abort the function before completion or to undo the function after completion.
                    </li>
                    <li>
                        <Markup.Term>Up reversal.</Markup.Term> The up-event reverses any outcome of the preceding down-event.
                    </li>
                </ol>
                Exception: This requirement does not apply if completing the function on the down-event is{' '}
                <NewTabLink href="https://www.w3.org/TR/WCAG21/#dfn-essential">essential</NewTabLink> to the underlying function. For
                example, for a keyboard emulator, entering a key press on the down-event is considered essential.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const PointerCancellation: Requirement = {
    key: PointerMotionTestStep.pointerCancellation,
    name: 'Pointer cancellation',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_2],
};
