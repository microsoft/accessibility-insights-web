// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/focus/revealing-content';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Activating a component that reveals hidden content must move input focus into the revealed
        content.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any "trigger" components (typically buttons or
                links) that reveal hidden menus or dialogs.
            </li>
            <li>Use the keyboard to activate each trigger component.</li>
            <li>
                Verify that focus is moved into the revealed content. (It is acceptable to{' '}
                <Markup.Term>Tab</Markup.Term> once or use an arrow key to move focus into the
                revealed content.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const RevealingContent: Requirement = {
    key: visibleFfocusOrderTestStep.revealingContent,
    name: 'Revealing content',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_3],
    ...content,
};
