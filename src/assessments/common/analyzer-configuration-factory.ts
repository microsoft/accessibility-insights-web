// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';

export class AnalyzerConfigurationFactory {
    public static forScanner(base: Partial<RuleAnalyzerConfiguration>): RuleAnalyzerConfiguration {
        const defaultValues: Partial<RuleAnalyzerConfiguration> = {
            resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
            telemetryProcessor: telemetryFactory => telemetryFactory.forAssessmentRequirementScan,
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
        };

        return {
            ...defaultValues,
            ...base,
        } as RuleAnalyzerConfiguration;
    }
}
