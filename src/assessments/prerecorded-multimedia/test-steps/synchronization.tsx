// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { link } from '../../../content/link';
import * as content from '../../../content/test/multimedia/synchronization';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { PrerecordedMultimediaTestStep } from './test-steps';

const synchronizationDescription: JSX.Element = <span>An audio description must be synchronized with the video content.</span>;

const synchronizationHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>Examine the target page to identify any pre-recorded multimedia content with an audio description.</li>
            <li>Enable audio descriptions, then play the multimedia content.</li>
            <li>Verify that the audio description is synchronized with the video content.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const Synchronization: TestStep = {
    key: PrerecordedMultimediaTestStep.synchronization,
    name: 'Synchronization',
    description: synchronizationDescription,
    howToTest: synchronizationHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_5],
};
