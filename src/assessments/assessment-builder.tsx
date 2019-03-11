// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { AssessmentToggleActionPayload } from '../background/actions/action-payloads';
import { InstanceIdentifierGenerator } from '../background/instance-identifier-generator';
import { RequirementComparer } from '../common/assessment/requirement-comparer';
import { IAssesssmentVisualizationConfiguration } from '../common/configs/visualization-configuration-factory';
import { Messages } from '../common/messages';
import { ManualTestStatus } from '../common/types/manual-test-status';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { IAssessmentScanData, IScanData } from '../common/types/store-data/ivisualization-store-data';
import { AssessmentInstanceTable, IAssessmentInstanceRowData } from '../DetailsView/components/assessment-instance-table';
import { AssessmentTestView } from '../DetailsView/components/assessment-test-view';
import { TestStepLink } from '../DetailsView/components/test-step-link';
import { AnalyzerProvider } from '../injected/analyzers/analyzer-provider';
import {
    IPropertyBags,
    IVisualizationInstanceProcessorCallback,
    VisualizationInstanceProcessor,
} from '../injected/visualization-instance-processor';
import { DrawerProvider } from '../injected/visualization/drawer-provider';
import { DecoratedAxeNodeResult, ScannerUtils } from './../injected/scanner-utils';
import { Assessment, AssistedAssessment, ManualAssessment } from './types/iassessment';
import { ReportInstanceField } from './types/report-instance-field';
import { TestStep } from './types/test-step';

export class AssessmentBuilder {
    private static applyDefaultReportFieldMap(step: TestStep) {
        const { comment, snippet, path } = ReportInstanceField.common;

        const defaults = step.isManual ? [comment] : [path, snippet];
        const specified = step.reportInstanceFields || [];

        step.reportInstanceFields = [...defaults, ...specified];
    }

    private static applyDefaultFunctions(step: TestStep): void {
        if (!step.getInstanceStatus) {
            step.getInstanceStatus = AssessmentBuilder.getInstanceStatus;
        }

        if (!step.getInstanceStatusColumns) {
            step.getInstanceStatusColumns = AssessmentBuilder.getInstanceStatusColumns;
        }

        if (!step.renderInstanceTableHeader) {
            step.renderInstanceTableHeader = AssessmentBuilder.renderInstanceTableHeader;
        }

        if (!step.renderRequirementDescription) {
            step.renderRequirementDescription = AssessmentBuilder.renderRequirementDescription;
        }

        if (!step.getDefaultMessage) {
            step.getDefaultMessage = defaultMessageGenerator => defaultMessageGenerator.getNoMatchingInstanceMessage;
        }
    }

    private static getInstanceStatus(result: DecoratedAxeNodeResult): ManualTestStatus {
        return ManualTestStatus.UNKNOWN;
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

    private static renderInstanceTableHeader(table: AssessmentInstanceTable, items: IAssessmentInstanceRowData[]): JSX.Element {
        return table.renderDefaultInstanceTableHeader(items);
    }

    private static renderRequirementDescription(testStepLink: TestStepLink): JSX.Element {
        return testStepLink.renderRequirementDescriptionWithIndex();
    }

    private static enableTest(scanData: IScanData, payload: AssessmentToggleActionPayload) {
        const scanAssessmentData = scanData as IAssessmentScanData;
        scanAssessmentData.enabled = true;
        scanAssessmentData.stepStatus[payload.step] = true;
    }

    private static disableTest(scanData: IScanData, step: string) {
        const scanAssessmentData = scanData as IAssessmentScanData;
        scanAssessmentData.stepStatus[step] = false;
        scanAssessmentData.enabled = Object.keys(scanAssessmentData.stepStatus).some(key => scanAssessmentData.stepStatus[key] === true);
    }

    private static getTestStatus(scanData: IScanData, step: string): boolean {
        const scanAssessmentData = scanData as IAssessmentScanData;
        return step in scanAssessmentData.stepStatus && scanAssessmentData.stepStatus[step];
    }

    public static Manual(assessment: ManualAssessment): Assessment {
        const { key, steps } = assessment;

        assessment.requirementOrder = assessment.requirementOrder || RequirementComparer.byOrdinal;
        assessment.executeAssessmentScanPolicy = assessment.executeAssessmentScanPolicy || AssessmentBuilder.nullScanPolicy;

        steps.forEach(AssessmentBuilder.applyDefaultReportFieldMap);
        steps.forEach(AssessmentBuilder.applyDefaultFunctions);

        const getAnalyzer = (provider: AnalyzerProvider, testStep: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            return provider.createBaseAnalyzer({
                key: stepConfig.key,
                testType: assessment.type,
                analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
            });
        };

        const getIdentifier = (testStep: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            return stepConfig.key;
        };

        const getNotificationMessage = (selectorMap: IDictionaryStringTo<any>, testStep?: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig.getNotificationMessage == null) {
                return null;
            }
            return stepConfig.getNotificationMessage(selectorMap);
        };

        const visualizationConfiguration: IAssesssmentVisualizationConfiguration = {
            getTestView: props => <AssessmentTestView {...props} />,
            getStoreData: data => data.assessments[`${key}Assessment`],
            enableTest: AssessmentBuilder.enableTest,
            disableTest: AssessmentBuilder.disableTest,
            getTestStatus: AssessmentBuilder.getTestStatus,
            getAssessmentData: data => data.assessments[key],
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
            key: `${key}Assessment`,
            getAnalyzer: getAnalyzer,
            getIdentifier: getIdentifier,
            visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
            getDrawer: provider => provider.createNullDrawer(),
            getNotificationMessage: getNotificationMessage,
            getSwitchToTargetTabOnScan: this.getSwitchToTargetTabOnScan(steps),
            getInstanceIdentiferGenerator: this.getInstanceIdentifier(steps),
            getUpdateVisibility: this.getUpdateVisibility(steps),
        };

        this.BuildStepsReportDescription(steps);

        return {
            getVisualizationConfiguration: () => visualizationConfiguration,
            requirementOrder: RequirementComparer.byOrdinal,
            ...assessment,
        } as Assessment;
    }

    public static Assisted(assessment: AssistedAssessment): Assessment {
        const { key, steps } = assessment;

        assessment.requirementOrder = assessment.requirementOrder || RequirementComparer.byOrdinal;

        steps.forEach(AssessmentBuilder.applyDefaultReportFieldMap);
        steps.forEach(AssessmentBuilder.applyDefaultFunctions);

        const getAnalyzer = (provider: AnalyzerProvider, testStep: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig.getAnalyzer == null) {
                return provider.createBaseAnalyzer({
                    key: stepConfig.key,
                    testType: assessment.type,
                    analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
                });
            }
            return stepConfig.getAnalyzer(provider);
        };

        const getIdentifier = (testStep: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            return stepConfig.key;
        };

        const getDrawer = (provider: DrawerProvider, testStep: string, featureFlagStoreData?: FeatureFlagStoreData) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig.getDrawer == null) {
                return provider.createNullDrawer();
            }
            return stepConfig.getDrawer(provider, featureFlagStoreData);
        };

        const getNotificationMessage = (selectorMap: IDictionaryStringTo<any>, testStep?: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig.getNotificationMessage == null) {
                return null;
            }
            return stepConfig.getNotificationMessage(selectorMap);
        };

        assessment.executeAssessmentScanPolicy = assessment.executeAssessmentScanPolicy || AssessmentBuilder.nullScanPolicy;

        const visualizationConfiguration: IAssesssmentVisualizationConfiguration = {
            getTestView: props => <AssessmentTestView {...props} />,
            getAssessmentData: data => data.assessments[key],
            setAssessmentData: (data, selectorMap, instanceMap) => {
                const thisAssessment = data.assessments[key];
                thisAssessment.fullAxeResultsMap = selectorMap;
                thisAssessment.generatedAssessmentInstancesMap = instanceMap;
            },
            getStoreData: data => data.assessments[assessment.storeDataKey],
            enableTest: AssessmentBuilder.enableTest,
            disableTest: AssessmentBuilder.disableTest,
            getTestStatus: AssessmentBuilder.getTestStatus,
            resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
            telemetryProcessor: factory => factory.forAssessmentRequirementScan,
            ...assessment.visualizationConfiguration,
            key: assessment.storeDataKey,
            getAnalyzer: getAnalyzer,
            getIdentifier: getIdentifier,
            visualizationInstanceProcessor: AssessmentBuilder.getVisualizationInstanceProcessor(steps),
            getDrawer: getDrawer,
            getNotificationMessage: getNotificationMessage,
            getSwitchToTargetTabOnScan: AssessmentBuilder.getSwitchToTargetTabOnScan(steps),
            getInstanceIdentiferGenerator: AssessmentBuilder.getInstanceIdentifier(steps),
            getUpdateVisibility: AssessmentBuilder.getUpdateVisibility(steps),
        } as IAssesssmentVisualizationConfiguration;

        AssessmentBuilder.BuildStepsReportDescription(steps);

        return {
            getVisualizationConfiguration: () => visualizationConfiguration,
            ...assessment,
        } as Assessment;
    }

    private static getStepConfig(steps: TestStep[], testStep: string) {
        return steps.find(step => step.key === testStep);
    }

    private static getVisualizationInstanceProcessor(steps: TestStep[]) {
        return (testStep: string): IVisualizationInstanceProcessorCallback<IPropertyBags, IPropertyBags> => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig == null || stepConfig.visualizationInstanceProcessor == null) {
                return VisualizationInstanceProcessor.nullProcessor;
            }
            return stepConfig.visualizationInstanceProcessor;
        };
    }

    private static getSwitchToTargetTabOnScan(steps: TestStep[]) {
        return (testStep: string): boolean => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig == null || stepConfig.switchToTargetTabOnScan == null) {
                return false;
            }
            return stepConfig.switchToTargetTabOnScan;
        };
    }

    private static getInstanceIdentifier(steps: TestStep[]) {
        return (testStep: string) => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig == null || stepConfig.generateInstanceIdentifier == null) {
                return InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier;
            }
            return stepConfig.generateInstanceIdentifier;
        };
    }

    private static BuildStepsReportDescription(steps: TestStep[]) {
        steps.forEach(step => {
            step.renderReportDescription = () => {
                const descriptionCopy = _.cloneDeep(step.description);
                const children = AssessmentBuilder.removeLastDotFromDescription(descriptionCopy.props.children);
                descriptionCopy.props.children = children;

                return descriptionCopy;
            };
        });
    }

    private static removeLastDotFromDescription(children: any): any {
        if (Array.isArray(children)) {
            children[children.length - 1] = AssessmentBuilder.removeLastDotFromDescription(children[children.length - 1]);
        } else if (children instanceof Object) {
            children.props.children = AssessmentBuilder.removeLastDotFromDescription(children.props.children);
        } else if (children[children.length - 1] === '.') {
            children = children.slice(0, -1);
        }

        return children;
    }

    private static getUpdateVisibility(steps: TestStep[]) {
        return (testStep: string): boolean => {
            const stepConfig = AssessmentBuilder.getStepConfig(steps, testStep);
            if (stepConfig == null || stepConfig.updateVisibility == null) {
                return true;
            }
            return stepConfig.updateVisibility;
        };
    }

    private static nullScanPolicy(scan, data): void {}
}
