// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash/index';

import { AnalyzerConfigurationFactory } from '../../../../assessments/common/analyzer-configuration-factory';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { RuleAnalyzerConfiguration } from '../../../../injected/analyzers/ianalyzer';

const baseConfig: Readonly<Partial<RuleAnalyzerConfiguration>> = {
    key: 'test-key',
    testName: 'test-name',
    rules: ['rule-1', 'rule-2'],
    testType: -1 as VisualizationType,
};
describe('AnalyzerConfigurationFactoryTest', () => {
    test('default for rule analyzer', () => {
        const result = AnalyzerConfigurationFactory.forScanner(baseConfig);

        expect(baseConfig.key).toEqual(result.key);
        expect(baseConfig.rules).toEqual(result.rules);
        expect(baseConfig.testType).toEqual(result.testType);
        expect(isFunction(result.resultProcessor)).toBeTruthy();
        expect(isFunction(result.telemetryProcessor)).toBeTruthy();
        expect(Messages.Assessment.AssessmentScanCompleted).toEqual(result.analyzerMessageType);
    });

    test('default resultProcessor', () => {
        const getInstancesStub = {};
        const scannerStub = {
            getAllCompletedInstances: getInstancesStub,
        };

        const result = AnalyzerConfigurationFactory.forScanner(baseConfig);

        expect(getInstancesStub).toEqual(result.resultProcessor(scannerStub));
    });

    test('default telemetryProcessor', () => {
        const forRuleAnalyzerScanStub = {};
        const telemetryFactoryStub = {
            forAssessmentRequirementScan: forRuleAnalyzerScanStub,
        };

        const result = AnalyzerConfigurationFactory.forScanner(baseConfig);

        expect(forRuleAnalyzerScanStub).toEqual(result.telemetryProcessor(telemetryFactoryStub as TelemetryDataFactory));
    });
});
