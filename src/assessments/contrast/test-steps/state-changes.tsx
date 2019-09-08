// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MacContrastCheckerAppLink, WindowsContrastCheckerAppLink } from 'common/components/contrast-checker-app-links';
import { link } from 'content/link';
import * as content from 'content/test/contrast/state-changes';
import * as React from 'react';

import { StateChangesPropertyBag } from '../../../common/types/property-bag/state-changes';
import { VisualizationType } from '../../../common/types/visualization-type';
import { AssessmentVisualizationEnabledToggle } from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { NoValue, PropertyBagColumnRendererConfig } from '../../common/property-bag-column-renderer';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ContrastTestStep } from './test-steps';

const description: JSX.Element = <span>Any visual effect that indicates a component's state must have sufficient contrast.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement highlights links, native widgets, and custom widgets in the target page.</p>
        <ol>
            <li>
                In the target page, examine each highlighted element to determine whether it can adopt any of the following states:
                <ol>
                    <li>Focused</li>
                    <li>Mouseover</li>
                    <li>Selected</li>
                </ol>
            </li>
            <li>
                Identify any visual (non-text) indicators that communicate:
                <ol>
                    <li>The boundary of the component's clickable area (such as a border or background color)</li>
                    <li>The component's current state (such as a different background color or a check mark)</li>
                </ol>
            </li>
            <li>
                Use <WindowsContrastCheckerAppLink /> to verify that the visual indicator (or if you are testing on a Mac, the{' '}
                <MacContrastCheckerAppLink />) has a contrast ratio of at least 3:1 against the adjacent background.
            </li>
            <li>
                Exception: A lower contrast ratio is allowed if either of the following is true:
                <ol>
                    <li>The component is inactive/disabled.</li>
                    <li>The component's appearance is determined solely by the browser.</li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

const propertyBagConfig: PropertyBagColumnRendererConfig<StateChangesPropertyBag>[] = [
    {
        propertyName: 'accessibleName',
        displayName: 'Accessible name',
        defaultValue: NoValue,
    },
    {
        propertyName: 'element',
        displayName: 'Element',
    },
    {
        propertyName: 'role',
        displayName: 'Role',
    },
];

export const StateChanges: Requirement = {
    key: ContrastTestStep.stateChanges,
    name: 'State changes',
    description,
    howToTest,
    ...content,
    guidanceLinks: [link.WCAG_1_4_11],
    isManual: false,
    columnsConfig: [
        {
            key: 'ui-component-info',
            name: 'UI component info',
            onRender: PropertyBagColumnRendererFactory.getRenderer(propertyBagConfig),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(propertyBagConfig),
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['link-purpose', 'native-widgets-default', 'custom-widget'],
                key: ContrastTestStep.stateChanges,
                testType: VisualizationType.ContrastAssessment,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createNonTextComponentDrawer(),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
