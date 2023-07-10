// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { AdaptableContentTestStep } from './test-step';

const highContrastInstructionsURL =
    '/insights.html#/content/test/adaptableContent/highContrastInstructions';

const highContrastModeDescription: JSX.Element = (
    <span>Websites and web apps must honor high contrast appearance settings and functions.</span>
);

const highContrastModeHowToTest: JSX.Element = (
    <div>
        Google Chrome and Microsoft Edge both support Windows' high contrast themes. Neither browser
        supports high contrast themes on macOS.
        <ol>
            <li>Open the target page.</li>
            <li>
                Apply a high contrast theme for your operating system using{' '}
                <NewTabLink href={highContrastInstructionsURL}>these instructions</NewTabLink>.
            </li>
            <li>Verify that the target page adopts the colors specified for the theme.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const HighContrastMode: Requirement = {
    key: AdaptableContentTestStep.highContrastMode,
    name: 'High contrast mode',
    description: highContrastModeDescription,
    howToTest: highContrastModeHowToTest,
    isManual: true,
    guidanceLinks: [link.InteroperabilityWithAT],
};
