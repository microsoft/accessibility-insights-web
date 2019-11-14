// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/images/captchas';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { ImagesTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If a CAPTCHA is used, alternative methods must be provided for both
        users without vision and users without hearing.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether it has a CAPTCHA.
                (A CAPTCHA is a test to differentiate a human from a computer.)
            </li>
            <li>
                If the page <Markup.Emphasis>does</Markup.Emphasis> have a
                CAPTCHA, verify that alternative methods are provided (at a
                minimum) for
                <ol>
                    <li>Users without vision</li>
                    <li>Users without hearing </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={false} />
        </ol>
    </div>
);

export const Captchas: Requirement = {
    key: ImagesTestStep.captcha,
    name: 'CAPTCHAs',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_1_1],
};
