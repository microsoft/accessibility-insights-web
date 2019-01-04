// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultMessageInterface } from '../../assessments/assessment-default-message-generator';
import { ColumnValue } from '../../common/types/property-bag/column-value-bag';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { OutcomeStats } from './components/outcome-type';

export interface IReportModel {
    summary: IOverviewSummaryReportModel;
    scanDetails: IScanDetailsReportModel;
    passedDetailsData: IAssessmentDetailsReportModel[];
    failedDetailsData: IAssessmentDetailsReportModel[];
    incompleteDetailsData: IAssessmentDetailsReportModel[];
}

export interface IScanDetailsReportModel {
    targetPage: string;
    url: string;
    reportDate: Date;
}

export interface IAssessmentDetailsReportModel {
    key: string;
    displayName: string;
    steps: IRequirementReportModel[];
}

export interface IOverviewSummaryReportModel {
    byRequirement: OutcomeStats;
    byPercentage: OutcomeStats;
    reportSummaryDetailsData: IAssessmentSummaryReportModel[];
}

export interface IAssessmentSummaryReportStats extends OutcomeStats {
}

export interface IAssessmentSummaryReportModel extends IAssessmentSummaryReportStats {
    displayName: string;
}
export type RequirementType = 'manual' | 'assisted';
export interface IRequirementHeaderReportModel {
    displayName: string;
    description: JSX.Element;
    guidanceLinks: HyperlinkDefinition[];
    requirementType: RequirementType;
}

export interface IRequirementReportModel {
    key: string;
    header: IRequirementHeaderReportModel;
    instances: IInstanceReportModel[];
    defaultMessageComponent: DefaultMessageInterface;
    showPassingInstances: boolean;
}

export interface IInstanceReportModel {
    props: IInstancePairReportModel[];
}

export type InstanceElementKey = 'Snippet' | 'Path' | 'Comment';

export interface IInstancePairReportModel {
    key: InstanceElementKey;
    value: ColumnValue;
}

