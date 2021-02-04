// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    MacContrastCheckerAppLink,
    WindowsContrastCheckerAppLink,
} from 'common/components/contrast-checker-app-links';
import {
    NoValue,
    PropertyBagColumnRendererConfig,
} from 'common/types/property-bag/property-bag-column-renderer-config';
import { StateChangesPropertyBag } from 'common/types/property-bag/state-changes';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/contrast/state-changes';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { PropertyBagColumnRendererFactory } from '../../common/property-bag-column-renderer-factory';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { ContrastTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Any visual information that indicates a component's state must have sufficient contrast.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            <Markup.Emphasis>
                Note: Contrast requirements for text within a UI component or graphic are covered in{' '}
                <Markup.Term>Automated checks</Markup.Term> and{' '}
                <Markup.Term>Adaptable content.</Markup.Term>
            </Markup.Emphasis>
        </p>
        <p>
            The visual helper for this requirement highlights links, native widgets, and custom
            widgets in the target page.
        </p>
        <ol>
            <li>
                In the target page, examine each highlighted element to determine whether it
                supports any of the following states:
                <ol>
                    <li>Focused</li>
                    <li>Hover (mouseover)</li>
                    <li>Selected</li>
                </ol>
            </li>
            <li>
                In each supported state (including combinations), use{' '}
                <WindowsContrastCheckerAppLink /> (or the <MacContrastCheckerAppLink /> if you are
                testing on a Mac) to verify that the following visual information, if present, has a
                contrast ratio of at least 3:1 against the adjacent background:
                <ol>
                    <li>Any visual information that's needed to identify the component</li>
                    <ol>
                        <li>
                            Visual information is almost always needed to identify text inputs,
                            checkboxes, and radio buttons.
                        </li>
                        <li>
                            Visual information might not be needed to identify other components if
                            they are identified by their position, text style, or context.
                        </li>
                    </ol>
                    <li>Any visual information that indicates the component's current state</li>
                </ol>
                Exceptions:
                <ol>
                    <li>
                        No minimum contrast ratio is required if either of the following is true:
                    </li>
                    <ol>
                        <li>The component is inactive/disabled.</li>
                        <li>The component's appearance is determined solely by the browser.</li>
                    </ol>
                    <li>
                        If a component has redundant state indicators (such as unique background
                        color and unique text style), only one indicator is required to have
                        sufficient contrast.
                    </li>
                    <li>
                        Hover indicators do not need to have sufficient contrast against the
                        background, but their presence must not cause other state indicators to lose
                        sufficient contrast.
                    </li>
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
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
