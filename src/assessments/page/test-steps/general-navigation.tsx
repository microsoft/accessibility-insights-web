// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/page/general-navigation';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Term } from '../../markup';
import { Requirement } from '../../types/requirement';
import { PageTestStep } from './test-steps';

const generalNavigationDescription: JSX.Element = (
    <span>Users must have multiple ways to navigate to a page.</span>
);

const generalNavigationHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether:
                <ol>
                    <li>
                        The page is part of a multi-page website or web app.
                        <ol>
                            <li>
                                If there are no other pages within the site or app, select{' '}
                                <Term>Pass</Term>.
                            </li>
                        </ol>
                    </li>
                    <li>
                        The page is the result of, or a step in, a process.
                        <ol>
                            <li>
                                If the page is part of a process, select <Term>Pass</Term>.
                            </li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>
                Verify that the page provides two or more ways to locate pages within the site or
                app, such as:
                <ol>
                    <li>Site maps</li>
                    <li>Site search</li>
                    <li>Tables of contents</li>
                    <li>Navigation menus or dropdowns</li>
                    <li>Navigation trees</li>
                    <li>Links between pages</li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const GeneralNavigation: Requirement = {
    key: PageTestStep.generalNavigation,
    name: 'Multiple ways',
    description: generalNavigationDescription,
    howToTest: generalNavigationHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_4_5],
};
