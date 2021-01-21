// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/sensory/auditory-cues';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { ColorSensoryTestStep } from './test-steps';

const auditoryCuesHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Interact with the target page to identify any instances where the system provides
                auditory cues, such as:
                <ol>
                    <li>A tone that indicates successful completion of a process</li>
                    <li>A tone that indicates arrival of a message</li>
                </ol>
            </li>
            <li>
                For each instance, verify that the system <Markup.Emphasis>also</Markup.Emphasis>{' '}
                provides a visible cue.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const auditoryCuesDescription: JSX.Element = (
    <span>Auditory cues must be accompanied by visual cues.</span>
);

export const AuditoryCues: Requirement = {
    key: ColorSensoryTestStep.auditoryCues,
    name: 'Auditory cues',
    description: auditoryCuesDescription,
    howToTest: auditoryCuesHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_1_1],
};
