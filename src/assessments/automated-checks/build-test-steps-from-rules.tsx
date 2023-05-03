// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    onRenderPathColumn,
    onRenderSnippetColumn,
} from 'assessments/common/element-column-renderers';
import { InstanceIdentifierGenerator } from 'background/instance-identifier-generator';
import { NewTabLink } from 'common/components/new-tab-link';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { AnalyzerConfiguration, RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { ScannerUtils } from 'injected/scanner-utils';
import * as React from 'react';
import { ScannerRuleInfo } from 'scanner/scanner-rule-info';
import { InstanceTableColumn } from '../types/instance-table-data';
import { Requirement } from '../types/requirement';
import { AutomatedChecksVisualizationToggle } from './automated-checks-visualization-enabled-toggle';

function buildAutomatedCheckStep(rule: ScannerRuleInfo): Requirement {
    const infoElement = <span>{rule.help}.</span>;
    const howToTest = (
        <React.Fragment>
            {infoElement}{' '}
            <NewTabLink href={rule.url} aria-label={`See more info here about ${rule.id} rule`}>
                See more info here.
            </NewTabLink>
        </React.Fragment>
    );
    const getAnalyzer = (provider: AnalyzerProvider, baseConfig: AnalyzerConfiguration) => {
        const analyzerConfiguration: RuleAnalyzerConfiguration = {
            ...baseConfig,
            resultProcessor: (scanner: ScannerUtils) => scanner.getFailingOrPassingInstances,
            telemetryProcessor: telemetryFactory => telemetryFactory.forAssessmentRequirementScan,
            rules: [rule.id],
        };

        return provider.createBatchedRuleAnalyzer(analyzerConfiguration);
    };

    const testStepConfig: Requirement = {
        key: rule.id,
        description: infoElement,
        name: rule.id,
        isManual: false,
        howToTest: howToTest,
        guidanceLinks: rule.a11yCriteria,
        getAnalyzer: getAnalyzer,
        getDrawer: provider => provider.createHighlightBoxDrawer(),
        generateInstanceIdentifier: InstanceIdentifierGenerator.generateSelectorIdentifier,
        columnsConfig: automatedChecksColumns,
        getInstanceStatus: getInstanceStatus,
        getInstanceStatusColumns: () => [],
        instanceTableHeaderType: 'none',
        getDefaultMessage: defaultMessageGenerator =>
            defaultMessageGenerator.getNoFailingInstanceMessage,
        getVisualHelperToggle: props => <AutomatedChecksVisualizationToggle {...props} />,
    };

    return testStepConfig;
}

export function buildTestStepsFromRules(rules: ScannerRuleInfo[]): Requirement[] {
    return rules.map(rule => buildAutomatedCheckStep(rule));
}

const automatedChecksColumns: InstanceTableColumn[] = [
    {
        key: 'path',
        name: 'Path',
        onRender: onRenderPathColumn,
    },
    {
        key: 'snippet',
        name: 'Snippet',
        onRender: onRenderSnippetColumn,
    },
];

function getInstanceStatus(result: DecoratedAxeNodeResult): ManualTestStatus {
    if (result.status === true) {
        return ManualTestStatus.PASS;
    } else {
        return ManualTestStatus.FAIL;
    }
}
