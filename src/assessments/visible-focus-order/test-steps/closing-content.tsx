// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/focus/closing-content';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Closing revealed content must return input focus to the component that
        revealed it.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Use the keyboard to activate any trigger component that reveals
                hidden content, such as menus, dialogs, expandable tree views,
                etc.
            </li>
            <li>
                If needed, use the <Markup.Term>Tab</Markup.Term> or arrow key
                to move focus into the revealed content.
            </li>
            <li>Use the keyboard to close or hide the revealed content.</li>
            <li>
                Verify that focus returns to the original trigger component. (It
                is acceptable to use <Markup.Term>Shift+Tab</Markup.Term>
                {' ' + ''}once or use an arrow key to move focus to the
                trigger.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const ClosingContent: Requirement = {
    key: visibleFfocusOrderTestStep.closingContent,
    name: 'Closing content',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_3],
    ...content,
};
