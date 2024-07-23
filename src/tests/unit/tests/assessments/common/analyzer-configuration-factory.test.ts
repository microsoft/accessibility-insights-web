// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AnalyzerConfigurationFactory } from 'assessments/common/analyzer-configuration-factory';
import { isFunction } from 'lodash';
import { Mock } from 'typemoq';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { RuleAnalyzerConfiguration } from '../../../../../injected/analyzers/analyzer';
import { ScannerUtils } from '../../../../../injected/scanner-utils';

const baseConfig: Readonly<Partial<RuleAnalyzerConfiguration>> = {
    key: 'test-key',
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
        const scannerMock = Mock.ofType<ScannerUtils>();
        scannerMock
            .setup(scanner => scanner.getAllCompletedInstances)
            .returns(() => {
                return getInstancesStub as any;
            });

        const result = AnalyzerConfigurationFactory.forScanner(baseConfig);

        expect(getInstancesStub).toEqual(result.resultProcessor(scannerMock.object));
    });

    test('default telemetryProcessor', () => {
        const forRuleAnalyzerScanStub = {};
        const telemetryFactoryStub = {
            forAssessmentRequirementScan: forRuleAnalyzerScanStub,
        };

        const result = AnalyzerConfigurationFactory.forScanner(baseConfig);

        expect(forRuleAnalyzerScanStub).toEqual(
            result.telemetryProcessor(telemetryFactoryStub as TelemetryDataFactory),
        );
    });
});
