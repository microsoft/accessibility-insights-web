// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/sensory/use-of-color';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ColorSensoryTestStep } from './test-steps';

const useOfColorHowToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement displays the target page in grayscale. </p>
        <ol>
            <li>
                Examine the target page to identify any instances where color is used to communicate
                meaning, such as:
                <ol>
                    <li>Communicating the status of a task or process</li>
                    <li>Indicating the state of a UI component (such as selected or focused)</li>
                    <li>Prompting a response</li>
                    <li>Identifying an error</li>
                </ol>
            </li>
            <li>
                For each instance, verify that at least one of these visual alternatives is also
                provided:
                <ol>
                    <li>
                        On-screen text that identifies the color itself and/or describes the meaning
                        conveyed by the color
                    </li>
                    <li>
                        Visual differentiation (e.g., shape, position, size, underline) and a clear
                        indication of its meaning
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const useOfColorDescription: JSX.Element = (
    <span>Color must not be used as the only visual means for conveying meaning.</span>
);

export const UseOfColor: Requirement = {
    key: ColorSensoryTestStep.useOfColor,
    name: 'Color as meaning',
    description: useOfColorDescription,
    howToTest: useOfColorHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_4_1],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['select-body'],
                key: ColorSensoryTestStep.useOfColor,
                testType: VisualizationType.ColorSensoryAssessment,
            }),
        ),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    getDrawer: provider => provider.createSingleTargetDrawer('insights-grey-scale-container'),
};
