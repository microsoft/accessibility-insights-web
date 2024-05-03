// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/target-size';
import * as React from 'react';
import { PropertyBagColumnRendererConfig } from '../../../common/types/property-bag/property-bag-column-renderer-config';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';
import { PropertyBagColumnRendererWithComputationFactory } from 'assessments/common/property-bag-column-renderer-factory';
import { ReportInstanceField } from 'assessments/types/report-instance-field';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { AnalyzerConfigurationFactory } from 'assessments/common/analyzer-configuration-factory';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { isEmpty } from 'lodash';
import { ChecksType } from 'background/assessment-data-converter';
import { getTargetSizeColumnComponents } from 'scanner/target-size-utils';

const description: JSX.Element = (
    <span>
        Touch targets must have sufficient size and spacing to be easily activated without
        accidentally activating an adjacent target.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                <p>
                    Examine the target page to identify interactive elements which have been created
                    by authors (non-native browser controls).
                </p>
            </li>
            <li>
                <p>
                    Verify these elements are a minimum size of 24x24 css pixels. The following
                    exceptions apply:
                </p>
                <ul>
                    <li>
                        <p>
                            <Markup.Emphasis>Spacing</Markup.Emphasis>: These elements may be
                            smaller than 24x24 css pixels so long as it is within a 24x24 css pixel
                            target spacing circle that doesn’t overlap with other targets or their
                            24x24 target spacing circle.
                        </p>
                    </li>
                    <li>
                        <p>
                            <Markup.Emphasis>Equivalent</Markup.Emphasis>: If an alternative control
                            is provided on the same page that successfully meets the target
                            criteria.
                        </p>
                    </li>
                    <li>
                        <p>
                            <Markup.Emphasis>Inline</Markup.Emphasis>: The target is in a sentence,
                            or its size is otherwise constrained by the line-height of non-target
                            text.
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
const computePropertyBagValue: (
    ruleType: 'size' | 'offset',
) => (propertyBag: TargetSizePropertyBag) => typeof React.Component =
    (ruleType: 'size' | 'offset') => (propertyBag: TargetSizePropertyBag) => {
        const targetSizeColumnComponentGetter =
            getTargetSizeColumnComponents(ruleType)(propertyBag);
        console.log('get using property bag values', targetSizeColumnComponentGetter);
        return targetSizeColumnComponentGetter;
    };

const displayPropertyBagConfig: PropertyBagColumnRendererConfig<TargetSizePropertyBag>[] = [
    {
        propertyName: 'sizeMessage',
        displayName: 'Size',
        defaultValue: null,
        neededPropertyBagValues: ['height', 'width', 'minSize'],
        compute: computePropertyBagValue('size'),
    },
    {
        propertyName: 'offsetMessage',
        displayName: 'Offset',
        defaultValue: null,
        neededPropertyBagValues: ['closestOffset', 'minOffset'],
        compute: computePropertyBagValue('offset'),
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
        console.log(data);
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
                PropertyBagColumnRendererWithComputationFactory.getRenderer<TargetSizePropertyBag>(
                    displayPropertyBagConfig,
                ),
        },
    ],
    reportInstanceFields: ReportInstanceField.fromColumns(displayPropertyBagConfig),
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
