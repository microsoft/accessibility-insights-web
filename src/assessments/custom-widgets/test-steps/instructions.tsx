// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { CustomWidgetPropertyBag } from 'common/types/property-bag/icustom-widgets';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/custom-widgets/instructions';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { InstructionsAndLabelsNotes } from '../../common/instructions-and-labels-note';
import { NoValue } from '../../common/property-bag-column-renderer';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const instructionsDescription: JSX.Element = (
    <span>If a custom widget has visible instructions, they must be programmatically related to it.</span>
);

const instructionsHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights custom widgets. (A custom widget is an element with a valid{' '}
            <NewTabLink href="https://www.w3.org/TR/wai-aria/#widget_roles">ARIA widget role</NewTabLink>.)
        </p>
        <InstructionsAndLabelsNotes />
        <ol>
            <li>In the target page, examine each highlighted element to determine whether it has a visible label or instructions.</li>
            <li>
                Verify that all visible labels and instructions are displayed in the Instances list:
                <ol>
                    <li>Any label should appear in the accessible name.</li>
                    <li>Any additional instructions should appear in the accessible description.</li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const Instructions: Requirement = {
    key: CustomWidgetsTestStep.instructions,
    name: 'Instructions',
    description: instructionsDescription,
    howToTest: instructionsHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1, link.WCAG_2_5_3],
    ...content,
    columnsConfig: [
        {
            key: 'instruction-info-custom-widgets',
            name: 'Instructions',
            onRender: CustomWidgetsColumnRendererFactory.getWithoutLink<CustomWidgetPropertyBag>([
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'accessibleName',
                    displayName: 'Accessible name',
                    defaultValue: NoValue,
                },
                {
                    propertyName: 'describedBy',
                    displayName: 'Accessible description',
                    defaultValue: NoValue,
                },
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<CustomWidgetPropertyBag>('Design pattern', 'designPattern', pb =>
            getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>('Accessible name', 'text'),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>('Accessible description', 'describedBy'),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['custom-widget'],
                key: CustomWidgetsTestStep.instructions,
                testType: VisualizationType.CustomWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
