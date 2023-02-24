// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentDefaultMessageGenerator,
    DefaultMessageInterface,
} from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentData,
    AssessmentStoreData,
    TestStepInstance,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { find, keys } from 'lodash';
import { assessmentReportExtensionPoint } from '../DetailsView/extensions/assessment-report-extension-point';
import {
    AssessmentDetailsReportModel,
    InstancePairReportModel,
    InstanceReportModel,
    ReportModel,
    RequirementReportModel,
} from './assessment-report-model';
import { getAssessmentSummaryModelFromResults } from './get-assessment-summary-model';

type AssessmentResult = Assessment & { storeData: AssessmentData };

export class AssessmentReportModelBuilder {
    constructor(
        private readonly assessmentsProvider: AssessmentsProvider,
        private readonly assessmentStoreData: AssessmentStoreData,
        private readonly targetAppInfo: TargetAppData,
        private readonly reportDate: Date,
        private assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ) {}

    public getReportModelData(): ReportModel {
        const assessmentDefaultMessageGeneratorInstance = this.assessmentDefaultMessageGenerator;
        const assessments: AssessmentResult[] = this.assessmentsProvider.all().map(a => ({
            ...a,
            storeData: this.assessmentStoreData.assessments[a.key],
        }));

        const scanDetails = {
            targetPage: this.targetAppInfo.name,
            url: this.targetAppInfo.url,
            reportDate: this.reportDate,
        };

        return {
            summary: getAssessmentSummaryModelFromResults(assessments),
            scanDetails: scanDetails,
            passedDetailsData: getDetails(ManualTestStatus.PASS),
            failedDetailsData: getDetails(ManualTestStatus.FAIL),
            incompleteDetailsData: getDetails(ManualTestStatus.UNKNOWN),
        } as ReportModel;

        function getDefaultMessageComponent(
            getDefaultMessage,
            instancesMap,
            selectedStep,
        ): DefaultMessageInterface {
            const defaultMessageGenerator = getDefaultMessage(
                assessmentDefaultMessageGeneratorInstance,
            );
            const defaultMessageComponent = defaultMessageGenerator(instancesMap, selectedStep);
            return defaultMessageComponent;
        }

        function getDetails(status: ManualTestStatus): AssessmentDetailsReportModel[] {
            return assessments
                .map(assessment => {
                    return {
                        key: assessment.key,
                        displayName: assessment.title,
                        steps: assessment.requirements
                            .filter(step => {
                                return (
                                    assessment.storeData.testStepStatus[step.key]
                                        .stepFinalResult === status
                                );
                            })
                            .map(step => {
                                const generatedInstancesMap =
                                    assessment.storeData.generatedAssessmentInstancesMap;
                                const model: RequirementReportModel = {
                                    key: step.key,
                                    header: {
                                        displayName: step.name,
                                        description: step.renderReportDescription!(),
                                        guidanceLinks: step.guidanceLinks,
                                        requirementType: step.isManual ? 'manual' : 'assisted',
                                    },
                                    instances: getInstances(assessment, step.key),
                                    defaultMessageComponent: getDefaultMessageComponent(
                                        step.getDefaultMessage,
                                        generatedInstancesMap,
                                        step.key,
                                    ),
                                    showPassingInstances: true,
                                };

                                assessmentReportExtensionPoint
                                    .apply(assessment.extensions!)
                                    .alterRequirementReportModel(model);

                                return model;
                            }),
                    } as AssessmentDetailsReportModel;
                })
                .filter(assessmentDetails => {
                    return assessmentDetails.steps.length > 0;
                }) as AssessmentDetailsReportModel[];
        }

        function getInstances(
            assessment: AssessmentResult,
            stepKey: string,
        ): InstanceReportModel[] {
            const { storeData } = assessment;
            const { reportInstanceFields } = find(assessment.requirements, s => s.key === stepKey)!;

            function getInstanceReportModel(
                instance: Partial<TestStepInstance>,
            ): InstanceReportModel {
                const props = reportInstanceFields!
                    .filter(element => {
                        if (element.getValue(instance)) {
                            return true;
                        }
                        return false;
                    })
                    .map(
                        ({ label, getValue }) =>
                            ({ key: label, value: getValue(instance) } as InstancePairReportModel),
                    );

                return { props };
            }

            function getManualData(): InstanceReportModel[] {
                return storeData.manualTestStepResultMap![stepKey].instances.map(instance =>
                    getInstanceReportModel(instance),
                );
            }

            function getAssistedData(): InstanceReportModel[] {
                if (storeData.generatedAssessmentInstancesMap == null) {
                    return [];
                }

                return keys(storeData.generatedAssessmentInstancesMap)
                    .filter(key => {
                        const testStepResult =
                            storeData.generatedAssessmentInstancesMap![key].testStepResults[
                                stepKey
                            ];
                        return (
                            testStepResult != null &&
                            testStepResult.status ===
                                storeData.testStepStatus[stepKey].stepFinalResult
                        );
                    })
                    .map(key =>
                        getInstanceReportModel(storeData.generatedAssessmentInstancesMap![key]),
                    );
            }

            if (
                storeData.testStepStatus[stepKey].stepFinalResult === ManualTestStatus.FAIL &&
                !(
                    storeData.manualTestStepResultMap![stepKey] === undefined ||
                    storeData.manualTestStepResultMap![stepKey].instances.length === 0
                )
            ) {
                return getManualData();
            }

            return getAssistedData();
        }
    }
}
