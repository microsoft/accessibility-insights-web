// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/multimedia/no-obstruction';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PrerecordedMultimediaTestStep } from './test-steps';

const noObstructionDescription: JSX.Element = (
    <span>Captions must not obscure or obstruct relevant information in the video.</span>
);

const noObstructionHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any pre-recorded multimedia content with
                captions.
            </li>
            <li>Determine whether the multimedia content has captions.</li>
            <li>Enable captions, then play the multimedia content.</li>
            <li>
                Verify that the captions do not obscure or obstruct relevant information in the
                video.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const NoObstruction: Requirement = {
    key: PrerecordedMultimediaTestStep.noObstruction,
    name: 'No obstruction',
    description: noObstructionDescription,
    howToTest: noObstructionHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_2_2],
};
