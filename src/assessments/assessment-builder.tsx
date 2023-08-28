// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IColumn } from '@fluentui/react';
import { AssessmentToggleActionPayload } from 'background/actions/action-payloads';
import { createInitialAssessmentTestData } from 'background/create-initial-assessment-test-data';
import {
    InstanceIdentifierGenerator,
    UniquelyIdentifiableInstances,
} from 'background/instance-identifier-generator';
import { AssessmentVisualizationConfiguration } from 'common/configs/assessment-visualization-configuration';
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentScanData, ScanData } from 'common/types/store-data/visualization-store-data';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { DrawerProvider } from 'injected/visualization/drawer-provider';
import {
    VisualizationInstanceProcessor,
    VisualizationInstanceProcessorCallback,
} from 'injected/visualization-instance-processor';
import { cloneDeep } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { Assessment, AssistedAssessment, ManualAssessment } from './types/iassessment';
import { ReportInstanceField, ReportInstanceFields } from './types/report-instance-field';
import { Requirement } from './types/requirement';

export class AssessmentBuilder {
    private static applyDefaultReportFieldMap(requirement: Requirement): void {
        const { comment, snippet, path, manualSnippet, manualPath } = ReportInstanceField.common;

        const defaults: ReportInstanceFields = requirement.isManual
            ? [comment, manualPath, manualSnippet]
            : [path, snippet];
        const specified: ReportInstanceFields = requirement.reportInstanceFields ?? [];

        requirement.reportInstanceFields = [...defaults, ...specified];
    }

    private static applyDefaultFunctions(requirement: Requirement): void {
        if (!requirement.getInstanceStatus) {
            requirement.getInstanceStatus = AssessmentBuilder.getInstanceStatus;
        }

        if (!requirement.getInitialManualTestStatus) {
            requirement.getInitialManualTestStatus = AssessmentBuilder.getInitialManualTestStatus;
        }

        if (!requirement.isVisualizationSupportedForResult) {
            requirement.isVisualizationSupportedForResult =
                AssessmentBuilder.isVisualizationSupportedForResult;
        }

        if (!requirement.getInstanceStatusColumns) {
            requirement.getInstanceStatusColumns = AssessmentBuilder.getInstanceStatusColumns;
        }

        if (!requirement.instanceTableHeaderType) {
            requirement.instanceTableHeaderType = 'default';
        }

        if (!requirement.getDefaultMessage) {
            requirement.getDefaultMessage = defaultMessageGenerator =>
                defaultMessageGenerator.getNoMatchingInstanceMessage;
        }
    }

    private static getInstanceStatus(result: DecoratedAxeNodeResult): ManualTestStatus {
        return ManualTestStatus.UNKNOWN;
    }

    private static getInitialManualTestStatus(
        instances: InstanceIdToInstanceDataMap,
    ): ManualTestStatus {
        return ManualTestStatus.UNKNOWN;
    }

    private static isVisualizationSupportedForResult(result: DecoratedAxeNodeResult): boolean {
        return true;
    }

    private static getInstanceStatusColumns(): Readonly<IColumn>[] {
        return [
            {
                key: 'statusChoiceGroup',
                name: 'Pass / Fail',
                ariaLabel: 'Pass',
                fieldName: 'statusChoiceGroup',
                minWidth: 100,
                maxWidth: 100,
                isResizable: false,
            },
        ];
    }

    private static enableTest(scanData: ScanData, payload: AssessmentToggleActionPayload): void {
        const scanAssessmentData = scanData as AssessmentScanData;
        scanAssessmentData.enabled = true;
        scanAssessmentData.stepStatus[payload.requirement] = true;
    }

    private static disableTest(scanData: ScanData, requirement: string): void {
        const scanAssessmentData = scanData as AssessmentScanData;
        scanAssessmentData.stepStatus[requirement] = false;
        scanAssessmentData.enabled = Object.keys(scanAssessmentData.stepStatus).some(
            key => scanAssessmentData.stepStatus[key] === true,
        );
    }

    private static getTestStatus(scanData: ScanData, requirement: string): boolean {
        const scanAssessmentData = scanData as AssessmentScanData;
        return (
            requirement in scanAssessmentData.stepStatus &&
            scanAssessmentData.stepStatus[requirement]
        );
    }

    public static Manual(assessment: ManualAssessment): Assessment {
        const { key, requirements } = assessment;

        assessment.initialDataCreator =
            assessment.initialDataCreator || createInitialAssessmentTestData;

        requirements.forEach(AssessmentBuilder.applyDefaultReportFieldMap);
        requirements.forEach(AssessmentBuilder.applyDefaultFunctions);

        const getAnalyzer = (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) => {
            return provider.createBaseAnalyzer(analyzerConfig);
        };

        const getNotificationMessage = (
            selectorMap: DictionaryStringTo<any>,
            requirement?: string,
        ) => {
            if (requirement == null) {
                return null;
            }
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirement,
            );
            if (requirementConfig?.getNotificationMessage == null) {
                return null;
            }
            return requirementConfig.getNotificationMessage(selectorMap);
        };

        const visualizationConfiguration: AssessmentVisualizationConfiguration = {
            key,
            testViewType: 'Assessment',
            enableTest: AssessmentBuilder.enableTest,
            disableTest: AssessmentBuilder.disableTest,
            getTestStatus: AssessmentBuilder.getTestStatus,
            getAssessmentData: data => data.assessments[key],
            getAnalyzer: getAnalyzer,
            visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
            getDrawer: provider => provider.createNullDrawer(),
            getNotificationMessage: getNotificationMessage,
            getSwitchToTargetTabOnScan: this.getSwitchToTargetTabOnScan(requirements),
            getInstanceIdentiferGenerator: this.getInstanceIdentifier(requirements),
            getTestViewContainer: (provider, props) =>
                provider.createAssessmentTestViewContainer(props),
        };

        this.buildRequirementReportDescription(requirements);

        return {
            getVisualizationConfiguration: () => visualizationConfiguration,
            ...assessment,
        } as Assessment;
    }

    public static Assisted(assessment: AssistedAssessment): Assessment {
        const {
            key,
            requirements,
            getTestViewContainer: getTestViewContainerOverride,
        } = assessment;

        assessment.initialDataCreator =
            assessment.initialDataCreator || createInitialAssessmentTestData;

        requirements.forEach(AssessmentBuilder.applyDefaultReportFieldMap);
        requirements.forEach(AssessmentBuilder.applyDefaultFunctions);

        const getAnalyzer = (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) => {
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                analyzerConfig.key,
            );
            if (requirementConfig?.getAnalyzer == null) {
                return provider.createBaseAnalyzer(analyzerConfig);
            }
            return requirementConfig.getAnalyzer(provider, analyzerConfig);
        };

        const getDrawer = (
            provider: DrawerProvider,
            requirement: string,
            featureFlagStoreData?: FeatureFlagStoreData,
        ) => {
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirement,
            );
            if (requirementConfig?.getDrawer == null) {
                return provider.createNullDrawer();
            }
            return requirementConfig.getDrawer(provider, featureFlagStoreData);
        };

        const getNotificationMessage = (
            selectorMap: DictionaryStringTo<any>,
            requirement?: string,
        ) => {
            if (requirement == null) {
                return null;
            }
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirement,
            );
            if (requirementConfig?.getNotificationMessage == null) {
                return null;
            }
            return requirementConfig.getNotificationMessage(selectorMap);
        };

        const getTestViewContainer =
            getTestViewContainerOverride ??
            ((provider, props) => provider.createAssessmentTestViewContainer(props));

        const visualizationConfiguration: AssessmentVisualizationConfiguration = {
            key,
            testViewType: 'Assessment',
            getAssessmentData: data => data.assessments[key],
            setAssessmentData: (data, selectorMap, instanceMap) => {
                const thisAssessment = data.assessments[key];
                thisAssessment.fullAxeResultsMap = selectorMap;
                thisAssessment.generatedAssessmentInstancesMap = instanceMap;
            },
            enableTest: AssessmentBuilder.enableTest,
            disableTest: AssessmentBuilder.disableTest,
            getTestStatus: AssessmentBuilder.getTestStatus,
            telemetryProcessor: factory => factory.forAssessmentRequirementScan,
            ...assessment.visualizationConfiguration,
            getAnalyzer: getAnalyzer,
            visualizationInstanceProcessor:
                AssessmentBuilder.getVisualizationInstanceProcessor(requirements),
            getDrawer: getDrawer,
            getNotificationMessage: getNotificationMessage,
            getSwitchToTargetTabOnScan: AssessmentBuilder.getSwitchToTargetTabOnScan(requirements),
            getInstanceIdentiferGenerator: AssessmentBuilder.getInstanceIdentifier(requirements),
            getTestViewContainer,
        } as AssessmentVisualizationConfiguration;

        AssessmentBuilder.buildRequirementReportDescription(requirements);

        return {
            getVisualizationConfiguration: () => visualizationConfiguration,
            ...assessment,
        } as Assessment;
    }

    private static getRequirementConfig(
        requirements: Requirement[],
        requirementKey: string,
    ): Requirement | undefined {
        return requirements.find(req => req.key === requirementKey);
    }

    private static getVisualizationInstanceProcessor(
        requirements: Requirement[],
    ): (requirement: string) => VisualizationInstanceProcessorCallback {
        return (requirementKey: string): VisualizationInstanceProcessorCallback => {
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirementKey,
            );
            if (
                requirementConfig == null ||
                requirementConfig.visualizationInstanceProcessor == null
            ) {
                return VisualizationInstanceProcessor.nullProcessor;
            }
            return requirementConfig.visualizationInstanceProcessor;
        };
    }

    private static getSwitchToTargetTabOnScan(
        requirements: Requirement[],
    ): (requirementKey: string) => boolean {
        return (requirement: string): boolean => {
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirement,
            );
            if (requirementConfig == null || requirementConfig.switchToTargetTabOnScan == null) {
                return false;
            }
            return requirementConfig.switchToTargetTabOnScan;
        };
    }

    private static getInstanceIdentifier(
        requirements: Requirement[],
    ): (requirement: string) => (instance: UniquelyIdentifiableInstances) => string {
        return (requirementKey: string) => {
            const requirementConfig = AssessmentBuilder.getRequirementConfig(
                requirements,
                requirementKey,
            );
            if (requirementConfig == null || requirementConfig.generateInstanceIdentifier == null) {
                return InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier;
            }
            return requirementConfig.generateInstanceIdentifier;
        };
    }

    private static buildRequirementReportDescription(requirements: Requirement[]): void {
        requirements.forEach(requirement => {
            requirement.renderReportDescription = () => {
                const descriptionCopy = cloneDeep(requirement.description);
                const children = AssessmentBuilder.removeLastDotFromDescription(
                    descriptionCopy.props.children,
                );
                descriptionCopy.props.children = children;

                return descriptionCopy;
            };
        });
    }

    private static removeLastDotFromDescription(children: any): any {
        if (Array.isArray(children)) {
            children[children.length - 1] = AssessmentBuilder.removeLastDotFromDescription(
                children[children.length - 1],
            );
        } else if (children instanceof Object) {
            children.props.children = AssessmentBuilder.removeLastDotFromDescription(
                children.props.children,
            );
        } else if (children[children.length - 1] === '.') {
            children = children.slice(0, -1);
        }

        return children;
    }
}
