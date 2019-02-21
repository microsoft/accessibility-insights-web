// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { TestStep } from '../../types/test-step';
import { SemanticsTestStep } from './test-steps';

const cssContentHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights content inserted in the page using CSS <Markup.Term>:before</Markup.Term> or{' '}
            <Markup.Term>:after</Markup.Term>.
        </p>
        <ol>
            <li>
                In the target page, examine each highlighted item to verify that it is decorative. An element is{' '}
                <Markup.Emphasis>decorative</Markup.Emphasis> if it could be removed from the page with{' '}
                <Markup.Emphasis>no</Markup.Emphasis> impact on meaning or function.
            </li>

            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const cssContentDescription: JSX.Element = (
    <span>
        Meaningful content must not be inserted using CSS <Markup.Term>:before</Markup.Term> or <Markup.Term>:after</Markup.Term>.
    </span>
);

export const CssContent: TestStep = {
    key: SemanticsTestStep.cssContent,
    name: 'CSS content',
    description: cssContentDescription,
    howToTest: cssContentHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
