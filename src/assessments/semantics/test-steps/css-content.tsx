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
        <p>The visual helper for this requirement displays the target page in grayscale. </p>
        <ol>
            <li>css content how to test</li>

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
    name: 'CSS Content',
    description: cssContentDescription,
    howToTest: cssContentHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: [],
                key: SemanticsTestStep.cssContent,
                testType: -1,
            }),
        ),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    getDrawer: provider => provider.createHighlightBoxDrawer(),
};
