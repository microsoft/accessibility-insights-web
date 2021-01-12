// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { AdaptableContentTestStep } from './test-step';

const highContrastModeDescription: JSX.Element = (
    <span>Websites and web apps must honor high contrast appearance settings and functions.</span>
);

const highContrastModeHowToTest: JSX.Element = (
    <div>
        Google Chrome does not support Windows' high contrast mode.
        <ol>
            <li>Open the target page in the new Microsoft Edge or Microsoft Edge Legacy.</li>
            <li>
                Use <Markup.Term>Windows Settings</Markup.Term> {'>'}{' '}
                <Markup.Term>Ease of Access</Markup.Term> {'>'}{' '}
                <Markup.Term>High contrast</Markup.Term> to apply a high contrast theme.
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
