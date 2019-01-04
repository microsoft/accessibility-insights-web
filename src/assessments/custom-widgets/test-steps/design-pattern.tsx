// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AnalyzerConfigurationFactory } from '../../../assessments/common/analyzer-configuration-factory';
import { NewTabLink } from '../../../common/components/new-tab-link';
import { ICustomWidgetPropertyBag } from '../../../common/types/property-bag/icustom-widgets';
import { VisualizationType } from '../../../common/types/visualization-type';
import { link } from '../../../content/link';
import { productName } from '../../../content/strings/application';
import {
    AssessmentVisualizationEnabledToggle,
} from '../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { ScannerUtils } from '../../../injected/scanner-utils';
import AssistedTestRecordYourResults from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { TestStep } from '../../types/test-step';
import { ReportInstanceField } from '../../types/report-instance-field';
import { getFlatDesignPatternStringFromRole } from '../custom-widgets-column-renderer';
import { CustomWidgetsColumnRendererFactory } from '../custom-widgets-column-renderer-factory';
import { CustomWidgetsTestStep } from './test-steps';

const designPatternDescription: JSX.Element = (
    <span>
        A custom widget must have the appropriate ARIA widget role for its design pattern.
    </span>
);

const designPatternHowToTest: JSX.Element = (
    <div>
        For this requirement, {productName} highlights custom widgets.
        (A custom widget is an element with a valid ARIA widget role.)
        <ol>
            <li>
                Familiarize yourself with
                the <NewTabLink href="https://www.w3.org/TR/wai-aria-practices-1.1/">
                    ARIA design patterns
                </NewTabLink> for custom widgets.
            </li>
            <li>
                In the target page, examine each custom widget to determine which design pattern best describes its function.
            </li>
            <li>
                In the <Markup.Term>Instances</Markup.Term> list below, verify that the custom widget has the right role for its design pattern.
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);
export const DesignPattern: TestStep = {
    key: CustomWidgetsTestStep.designPattern,
    name: 'Design pattern',
    description: designPatternDescription,
    howToTest: designPatternHowToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_4_1_2],
    columnsConfig: [
        {
            key: 'design-pattern-info',
            name: 'Design pattern',
            onRender: CustomWidgetsColumnRendererFactory.getWithLink<ICustomWidgetPropertyBag>([
                {
                    propertyName: 'role',
                    displayName: 'Widget role',
                    defaultValue: '-',
                },
                {
                    propertyName: 'designPattern',
                    displayName: 'Design pattern',
                    defaultValue: '-',
                },
                {
                    propertyName: 'text',
                    displayName: 'Accesssible name',
                    defaultValue: '-',
                },
            ]),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('Widget role', 'role'),
        ReportInstanceField.fromPropertyBagFunction<ICustomWidgetPropertyBag>('Design pattern', 'designPattern',
            pb => getFlatDesignPatternStringFromRole(pb.role)),
        ReportInstanceField.fromColumnValueBagField<ICustomWidgetPropertyBag>('Accesssible name', 'text'),
    ],
    getAnalyzer: provider => provider.createRuleAnalyzer(AnalyzerConfigurationFactory.forScanner({
        rules: ['custom-widget'],
        key: CustomWidgetsTestStep.designPattern,
        testType: VisualizationType.CustomWidgets,
        resultProcessor: (scanner: ScannerUtils) => scanner.getPassingInstances,
    })),
    getDrawer: provider => provider.createCustomWidgetsDrawer(),
    updateVisibility: false,
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props}/>,
}
