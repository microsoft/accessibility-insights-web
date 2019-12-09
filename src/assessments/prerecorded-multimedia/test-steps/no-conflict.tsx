// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/multimedia/no-conflict';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PrerecordedMultimediaTestStep } from './test-steps';

const noConflictDescription: JSX.Element = (
    <span>An audio description must not conflict with audible information in the sound track.</span>
);

const noConflictHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded multimedia content with an
                audio description.
            </li>
            <li>Enable audio descriptions, then play the multimedia content.</li>
            <li>
                Verify that the audio description does not conflict with relevant information in the
                soundtrack. (Descriptive narration should be added during existing pauses in
                dialog.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoConflict: Requirement = {
    key: PrerecordedMultimediaTestStep.noConflict,
    name: 'No conflict',
    description: noConflictDescription,
    howToTest: noConflictHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_5],
};
