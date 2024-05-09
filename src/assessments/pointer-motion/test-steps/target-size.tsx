// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AnalyzerConfigurationFactory } from 'assessments/common/analyzer-configuration-factory';
import {
    getTargetOffsetMessageComponentFromPropertyBag,
    getTargetSizeMessageComponentFromPropertyBag,
} from 'assessments/pointer-motion/target-size-column-renderer';
import { TargetSizeColumnRendererFactory } from 'assessments/pointer-motion/target-size-column-renderer-factory';
import { ReportInstanceField } from 'assessments/types/report-instance-field';
import { ChecksType } from 'background/assessment-data-converter';
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/target-size';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import * as React from 'react';
import { PropertyBagColumnRendererConfig } from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';
import { ScannerUtils } from 'injected/scanner-utils';
import { isEmpty } from 'lodash';

const description: JSX.Element = (
    <span>
        Touch targets must have sufficient size and spacing to be easily activated without
        accidentally activating an adjacent target.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            For this requirement, Accessibility Insights for Web highlights non-inline focusable
            elements on the target page and checks the touch target size.
        </p>
        <p>
            <Markup.Emphasis>
                Note: If no matching/failing instances are found, this requirement will
                automatically be marked as pass.
            </Markup.Emphasis>
        </p>
        <ol>
            <li>
                <p>
                    In the <Markup.Term>Instances</Markup.Term> list below, examine each element,
                    and verify the element is a <Markup.Term>sufficient size</Markup.Term> and{' '}
                    <Markup.Term>sufficient offset</Markup.Term> from its neighbor.
                </p>
            </li>
            <li>
                <p>
                    If an element does not have sufficient size and/or sufficient offset from its
                    neighbor, verify the following exceptions do not apply:
                </p>
                <ul>
                    <li>
                        <p>
                            <Markup.Emphasis>Equivalent</Markup.Emphasis>: If an alternative control
                            is provided on the same page that successfully meets the target
                            criteria.
                        </p>
                    </li>
                    <li>
                        <p>
                            <Markup.Emphasis>User agent control</Markup.Emphasis>: The size of the
                            target is determined by the user agent and is not modified by the
                            author.
                        </p>
                    </li>
                    <li>
                        <p>
                            <Markup.Emphasis>Essential</Markup.Emphasis>: A particular presentation
                            of the target is essential or is legally required for the information to
                            be conveyed.
                        </p>
                    </li>
                </ul>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const displayPropertyBagConfig: PropertyBagColumnRendererConfig<TargetSizePropertyBag>[] = [
    {
        propertyName: 'sizeComponent',
        displayName: 'Size',
        defaultValue: null,
    },
    {
        propertyName: 'offsetComponent',
        displayName: 'Offset',
        defaultValue: null,
    },
];

const generateTargetSizePropertyBagFrom = (
    ruleResult: DecoratedAxeNodeResult,
    checkName: ChecksType,
): TargetSizePropertyBag => {
    if (
        ruleResult[checkName] &&
        !isEmpty(ruleResult[checkName]) &&
        ruleResult[checkName].some(r => r.data)
    ) {
        const status =
            ruleResult.status === true
                ? 'pass'
                : ruleResult.status === false
                  ? 'fail'
                  : 'incomplete';
        const data = Object.assign(
            {},
            ...ruleResult[checkName].map(r => {
                return {
                    ...r.data,
                    [`${r.id.split('-')[1]}Status`]: status,
                    [`${r.id.split('-')[1]}MessageKey`]: r.data.messageKey,
                };
            }),
        );
        return data;
    }
    return null;
};
export const TargetSize: Requirement = {
    key: PointerMotionTestStep.targetSize,
    name: 'Target size',
    description,
    howToTest,
    ...content,
    isManual: false,
    columnsConfig: [
        {
            key: 'touch-target-info',
            name: 'Touch target info',
            onRender:
                TargetSizeColumnRendererFactory.getColumnComponent<TargetSizePropertyBag>(
                    displayPropertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<TargetSizePropertyBag>(
            'Size',
            'sizeComponent',
            pb => getTargetSizeMessageComponentFromPropertyBag(pb).toString(),
        ),
        ReportInstanceField.fromPropertyBagFunction<TargetSizePropertyBag>(
            'Offset',
            'offsetComponent',
            pb => getTargetOffsetMessageComponentFromPropertyBag(pb).toString(),
        ),
    ],
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['target-size'],
                resultProcessor: (scanner: ScannerUtils) => scanner.getAllApplicableInstances,
                ...analyzerConfig,
            }),
        ),
    guidanceLinks: [link.WCAG_2_5_8],
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    generatePropertyBagFrom: generateTargetSizePropertyBagFrom,
    // getCompletedRequirementDetailsForTelemetry: labelInNameGetCompletedRequirementDetails,
};
