// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatten } from 'lodash';

import { Assessment } from '../../../../assessments/types/iassessment';
import { ReportInstanceFields } from '../../../../assessments/types/report-instance-field';
import { ManualTestStatus, ManualTestStatusData } from '../../../../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    PersistedTabInfo,
} from '../../../../common/types/store-data/iassessment-result-data';
import { excludePassingInstancesFromAssessmentReport } from '../../../../DetailsView/extensions/exclude-passing-instances-from-assessment-report';
import {
    IAssessmentDetailsReportModel,
    IInstanceReportModel,
    InstanceElementKey,
    IOverviewSummaryReportModel,
    IReportModel,
    IRequirementReportModel,
    IScanDetailsReportModel,
} from '../../../../DetailsView/reports/assessment-report-model';

export class AssessmentReportBuilderTestHelper {
    public static defaultMessageComponent = null;

    public static setMessageComponent(component): void {
        this.defaultMessageComponent = component;
    }

    public static readonly reportDate = new Date(Date.UTC(2000, 0, 1, 0, 0));

    private static getAssistedInstances(): IDictionaryStringTo<IGeneratedAssessmentInstance> {
        return {
            ['instance1']: {
                id: 'id1',
                html: 'someHtml',
                propertyBag: {
                    ['prop1']: 'value1',
                    ['prop2']: 'value2',
                },
                testStepResults: {
                    ['step1a']: {
                        id: 'step1a',
                        status: ManualTestStatus.PASS,
                    },
                    ['step2a']: {
                        id: 'step2a',
                        status: ManualTestStatus.FAIL,
                    },
                },
                target: ['target1'],
            },
            ['instance2']: {
                id: 'id1',
                html: 'someHtml',
                propertyBag: {
                    ['prop2']: 'value2',
                    ['prop3']: 'value3',
                },
                testStepResults: {
                    ['step2a']: {
                        id: 'step2a',
                        status: ManualTestStatus.PASS,
                    },
                    ['step3a']: {
                        id: 'step3a',
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
                target: ['target2'],
            },
        } as IDictionaryStringTo<IGeneratedAssessmentInstance>;
    }

    private static getManualInstance1(): IDictionaryStringTo<IManualTestStepResult> {
        return {
            ['step1a']: {
                status: ManualTestStatus.FAIL,
                id: 'id1',
                instances: [],
            },
            ['step2a']: {
                status: ManualTestStatus.FAIL,
                id: 'id1',
                instances: [],
            },
            ['step3a']: {
                status: ManualTestStatus.FAIL,
                id: 'id1',
                instances: [],
            },
            ['step4a']: {
                status: ManualTestStatus.FAIL,
                id: 'id1',
                instances: [
                    {
                        id: 'instance1',
                        description: 'comment',
                        html: 'someHtml',
                        selector: 'target1',
                    },
                ],
            },
        } as IDictionaryStringTo<IManualTestStepResult>;
    }

    private static getManualInstance2(): IDictionaryStringTo<IManualTestStepResult> {
        return {
            ['step1b']: {
                status: ManualTestStatus.FAIL,
                id: 'id1',
                instances: [],
            },
        } as IDictionaryStringTo<IManualTestStepResult>;
    }

    private static getManualTestStatus1(): ManualTestStatusData {
        return {
            ['step1a']: {
                stepFinalResult: ManualTestStatus.PASS,
                isStepScanned: true,
            },
            ['step2a']: {
                stepFinalResult: ManualTestStatus.FAIL,
                isStepScanned: true,
            },
            ['step3a']: {
                stepFinalResult: ManualTestStatus.UNKNOWN,
                isStepScanned: true,
            },
            ['step4a']: {
                stepFinalResult: ManualTestStatus.FAIL,
                isStepScanned: true,
            },
        };
    }

    private static getManualTestStatus2(): ManualTestStatusData {
        return {
            ['step1b']: {
                stepFinalResult: ManualTestStatus.UNKNOWN,
                isStepScanned: false,
            },
            ['step2b']: {
                stepFinalResult: ManualTestStatus.FAIL,
                isStepScanned: false,
            },
        };
    }

    private static getAssessmentData1(): IAssessmentData {
        return {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: this.getAssistedInstances(),
            manualTestStepResultMap: this.getManualInstance1(),
            testStepStatus: this.getManualTestStatus1(),
        } as IAssessmentData;
    }

    private static getAssessmentData2(): IAssessmentData {
        return {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: this.getManualInstance2(),
            testStepStatus: this.getManualTestStatus2(),
        } as IAssessmentData;
    }

    public static getAssessmentStoreData(): IAssessmentStoreData {
        return {
            persistedTabInfo: {} as PersistedTabInfo,
            assessments: {
                ['assessment1']: this.getAssessmentData1(),
                ['assessment2']: this.getAssessmentData2(),
            },
            assessmentNavState: null,
        } as IAssessmentStoreData;
    }

    public static getAssessmentProviderAll(getDefaultMessage): Assessment[] {
        const manualFields: ReportInstanceFields = [{ key: 'comment', label: 'Comment', getValue: i => i.description }];

        const automaticFields: ReportInstanceFields = [
            { key: 'path', label: 'Path', getValue: i => i.target && i.target.join(', ') },
            { key: 'snippet', label: 'Snippet', getValue: i => i.html },
        ];

        return [
            {
                key: 'assessment1',
                title: 'Assessment1',
                steps: [
                    {
                        key: 'step1a',
                        name: 'Step1A',
                        isManual: false,
                        reportInstanceFields: automaticFields,
                        guidanceLinks: [
                            {
                                text: 'link1A',
                                href: 'link1A',
                            },
                        ],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                    {
                        key: 'step2a',
                        name: 'Step2A',
                        isManual: false,
                        reportInstanceFields: automaticFields,
                        guidanceLinks: [],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                    {
                        key: 'step3a',
                        name: 'Step3A',
                        isManual: false,
                        reportInstanceFields: automaticFields,
                        guidanceLinks: [],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                    {
                        key: 'step4a',
                        name: 'Step4A',
                        isManual: true,
                        reportInstanceFields: manualFields,
                        guidanceLinks: [],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                ],
                extensions: [excludePassingInstancesFromAssessmentReport],
            },
            {
                key: 'assessment2',
                title: 'Assessment2',
                steps: [
                    {
                        key: 'step1b',
                        name: 'Step1B',
                        isManual: false,
                        reportInstanceFields: automaticFields,
                        guidanceLinks: [],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                    {
                        key: 'step2b',
                        name: 'Step2B',
                        isManual: true,
                        reportInstanceFields: manualFields,
                        guidanceLinks: [],
                        renderReportDescription: () => {
                            return null;
                        },
                        getDefaultMessage: getDefaultMessage,
                    },
                ],
            },
        ] as Assessment[];
    }

    public static getStepKeysForAssessment(assessmentKey: string, data: Assessment[]): string[] {
        return flatten(
            data
                .filter(assessmentContent => assessmentContent.key === assessmentKey)
                .map(assessmentContent => {
                    return assessmentContent.steps.map(step => step.key);
                }),
        );
    }

    public static getInstanceReportModelStep1PassStep2Fail(): IInstanceReportModel[] {
        const model: IInstanceReportModel[] = [
            {
                props: [
                    {
                        key: 'Path',
                        value: 'target1',
                    },
                    {
                        key: 'Snippet',
                        value: 'someHtml',
                    },
                ],
            },
        ];
        return model;
    }

    public static getInstanceReportModelStep3Unknown(): IInstanceReportModel[] {
        const model: IInstanceReportModel[] = [
            {
                props: [
                    {
                        key: 'Path',
                        value: 'target2',
                    },
                    {
                        key: 'Snippet',
                        value: 'someHtml',
                    },
                ],
            },
        ];
        return model;
    }

    public static getInstanceWithObjectValueProp(): IInstanceReportModel[] {
        return [
            {
                props: [
                    {
                        key: 'key1' as InstanceElementKey,
                        value: {
                            ['key1>1']: 'value1>1',
                        },
                    },
                ],
            },
        ] as IInstanceReportModel[];
    }

    public static getInstanceWithMixOfSimpleAndComplexValues(): IInstanceReportModel[] {
        return [
            {
                props: [
                    {
                        key: 'Complex Key One' as InstanceElementKey,
                        value: {
                            ['key1-1']: 'value1-1',
                            ['key1-2']: 'value1-2',
                        },
                    },
                    {
                        key: 'Simple Key One' as InstanceElementKey,
                        value: 'value1',
                    },
                    {
                        key: 'Complex Key Two' as InstanceElementKey,
                        value: {
                            ['key2-1']: 'value2-1',
                            ['key2-2']: 'value2-2',
                        },
                    },
                    {
                        key: 'Simple Key Two' as InstanceElementKey,
                        value: 'value2',
                    },
                    {
                        key: 'Sub Instance Value is null' as InstanceElementKey,
                        value: {
                            ['key2-1']: null,
                        },
                    },
                ],
            },
        ] as IInstanceReportModel[];
    }

    public static getInstanceReportModelManualStep4Fail(): IInstanceReportModel[] {
        const model: IInstanceReportModel[] = [
            {
                props: [
                    {
                        key: 'Comment',
                        value: 'comment',
                    },
                ],
            },
        ];
        return model;
    }

    public static getRequirementReportModelPass(): IRequirementReportModel[] {
        return [
            {
                key: 'step1a',
                header: {
                    description: null,
                    displayName: 'Step1A',
                    guidanceLinks: [
                        {
                            text: 'link1A',
                            href: 'link1A',
                        },
                    ],
                    requirementType: 'assisted',
                },
                instances: this.getInstanceReportModelStep1PassStep2Fail(),
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                showPassingInstances: false,
            },
        ] as IRequirementReportModel[];
    }

    public static getRequirementReportModelFail(): IRequirementReportModel[] {
        return [
            {
                key: 'step2a',
                header: {
                    description: null,
                    displayName: 'Step2A',
                    guidanceLinks: [],
                    requirementType: 'assisted',
                },
                instances: this.getInstanceReportModelStep1PassStep2Fail(),
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                showPassingInstances: false,
            },
            {
                key: 'step4a',
                header: {
                    description: null,
                    displayName: 'Step4A',
                    guidanceLinks: [],
                    requirementType: 'manual',
                },
                instances: this.getInstanceReportModelManualStep4Fail(),
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                showPassingInstances: false,
            },
        ] as IRequirementReportModel[];
    }

    private static getRequirementReportModelFailAssessment2(): IRequirementReportModel[] {
        return [
            {
                key: 'step2b',
                header: {
                    description: null,
                    displayName: 'Step2B',
                    guidanceLinks: [],
                    requirementType: 'manual',
                },
                instances: [],
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                showPassingInstances: true,
            },
        ] as IRequirementReportModel[];
    }

    public static getRequirementReportModelUnknownStep3(): IRequirementReportModel[] {
        return [
            {
                key: 'step3a',
                header: {
                    description: null,
                    displayName: 'Step3A',
                    guidanceLinks: [],
                    requirementType: 'assisted',
                },
                instances: this.getInstanceReportModelStep3Unknown(),
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                showPassingInstances: false,
            },
        ] as IRequirementReportModel[];
    }

    private static getRequirementReportModelUnknownStep1(): IRequirementReportModel[] {
        return [
            {
                key: 'step1b',
                header: {
                    description: null,
                    displayName: 'Step1B',
                    guidanceLinks: [],
                    requirementType: 'assisted',
                },
                defaultMessageComponent: AssessmentReportBuilderTestHelper.defaultMessageComponent,
                instances: [],
                showPassingInstances: true,
            },
        ] as IRequirementReportModel[];
    }

    public static getAssessmentDetailsReportModelPass(): IAssessmentDetailsReportModel[] {
        return [
            {
                key: 'assessment1',
                displayName: 'Assessment1',
                steps: this.getRequirementReportModelPass(),
            },
        ] as IAssessmentDetailsReportModel[];
    }

    public static getAssessmentDetailsReportModelFail(): IAssessmentDetailsReportModel[] {
        return [
            {
                key: 'assessment1',
                displayName: 'Assessment1',
                steps: this.getRequirementReportModelFail(),
            },
            {
                key: 'assessment2',
                displayName: 'Assessment2',
                steps: this.getRequirementReportModelFailAssessment2(),
            },
        ] as IAssessmentDetailsReportModel[];
    }

    public static getAssessmentDetailsReportModelUnknown(): IAssessmentDetailsReportModel[] {
        return [
            {
                key: 'assessment1',
                displayName: 'Assessment1',
                steps: this.getRequirementReportModelUnknownStep3(),
            },
            {
                key: 'assessment2',
                displayName: 'Assessment2',
                steps: this.getRequirementReportModelUnknownStep1(),
            },
        ] as IAssessmentDetailsReportModel[];
    }

    public static getAssessmentsSummaryReportModel(): IOverviewSummaryReportModel {
        return {
            byPercentage: {
                pass: 13,
                fail: 50,
                incomplete: 37,
            },
            byRequirement: {
                pass: 1,
                fail: 3,
                incomplete: 2,
            },
            reportSummaryDetailsData: [
                {
                    displayName: 'Assessment1',
                    pass: 1,
                    fail: 2,
                    incomplete: 1,
                },
                {
                    displayName: 'Assessment2',
                    pass: 0,
                    fail: 1,
                    incomplete: 1,
                },
            ],
        } as IOverviewSummaryReportModel;
    }

    private static getAssessmentScanDetailsReportModel(): IScanDetailsReportModel {
        const dateWithFakeTimeZone = new Date(this.reportDate);
        dateWithFakeTimeZone.toLocaleTimeString = () => {
            return 'blah FTZ';
        };
        dateWithFakeTimeZone.getFullYear = () => {
            return dateWithFakeTimeZone.getUTCFullYear();
        };
        dateWithFakeTimeZone.getMonth = () => {
            return dateWithFakeTimeZone.getUTCMonth();
        };
        dateWithFakeTimeZone.getDate = () => {
            return dateWithFakeTimeZone.getUTCDate();
        };
        dateWithFakeTimeZone.getHours = () => {
            return dateWithFakeTimeZone.getUTCHours();
        };

        return {
            targetPage: 'title',
            url: 'url',
            reportDate: dateWithFakeTimeZone,
        } as IScanDetailsReportModel;
    }

    public static getAssessmentReportModel(): IReportModel {
        return {
            summary: this.getAssessmentsSummaryReportModel(),
            scanDetails: this.getAssessmentScanDetailsReportModel(),
            passedDetailsData: this.getAssessmentDetailsReportModelPass(),
            failedDetailsData: this.getAssessmentDetailsReportModelFail(),
            incompleteDetailsData: this.getAssessmentDetailsReportModelUnknown(),
        } as IReportModel;
    }
}
