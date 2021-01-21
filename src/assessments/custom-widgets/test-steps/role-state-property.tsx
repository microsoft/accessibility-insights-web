// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { CustomWidgetPropertyBag } from 'common/types/property-bag/custom-widgets-property-bag';
import { NoValue } from 'common/types/property-bag/property-bag-column-renderer-config';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { productName } from 'content/strings/application';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/custom-widgets/role-state-property';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const roleStatePropertyDescription: JSX.Element = (
    <span>
        A custom widget must support the ARIA roles, states, and properties specified by its design
        pattern.
    </span>
);

const roleStatePropertyHowToTest: JSX.Element = (
    <div>
        <p>For this requirement, {productName} highlights custom widgets.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the <Markup.Term>Instances</Markup.Term> list below, use the link for the design
                pattern that best describes the widget's function.
            </li>
            <li>
                Familiarize yourself with the "WAI-ARIA Roles, States, and Properties" section of
                the design pattern spec.
            </li>
            <li>
                Inspect the widget's HTML using the{' '}
                <NewTabLink href="https://developers.google.com/web/updates/2018/01/devtools">
                    Accessibility pane in the browser Developer Tools
                </NewTabLink>{' '}
                to verify that it supports all of the roles, states, and properties specified by its
                design pattern:
                <ul>
                    <li>
                        For a composite widget, use the Accessibility Tree to verify the role
                        hierarchy. (For example, verify that a menuitem exists for each option in a
                        menubar.)
                    </li>
                    <li>
                        View the widget's ARIA Attributes while you interact with it to verify that
                        required properties update according to spec. (For example, when a tree node
                        in a tree view is expanded, aria-expanded is "true" and when it isn't
                        expanded, it is "false".)
                    </li>
                </ul>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const RoleStateProperty: Requirement = {
    key: CustomWidgetsTestStep.roleStateProperty,
    name: 'Role, state, property',
    description: roleStatePropertyDescription,
    howToTest: roleStatePropertyHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_4_1_2],
    ...content,
    columnsConfig: [
        {
            key: 'role-state-property-info',
            name: 'Role, state, property',
            onRender: CustomWidgetsColumnRendererFactory.getWithLink<CustomWidgetPropertyBag>([
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
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<CustomWidgetPropertyBag>(
            'Design pattern',
            'designPattern',
            pb => getFlatDesignPatternStringFromRole(pb.role),
        ),
        ReportInstanceField.fromColumnValueBagField<CustomWidgetPropertyBag>(
            'Accessible name',
            'text',
        ),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['custom-widget'],
                key: CustomWidgetsTestStep.roleStateProperty,
                testType: VisualizationType.CustomWidgets,
                resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
