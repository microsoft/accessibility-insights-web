// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultMessageInterface } from '../../assessments/assessment-default-message-generator';
import { ColumnValue } from '../../common/types/property-bag/column-value-bag';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { OutcomeStats } from './components/outcome-type';

// tslint:disable-next-line:interface-name
export interface IReportModel {
    summary: IOverviewSummaryReportModel;
    scanDetails: IScanDetailsReportModel;
    passedDetailsData: IAssessmentDetailsReportModel[];
    failedDetailsData: IAssessmentDetailsReportModel[];
    incompleteDetailsData: IAssessmentDetailsReportModel[];
}

// tslint:disable-next-line:interface-name
export interface IScanDetailsReportModel {
    targetPage: string;
    url: string;
    reportDate: Date;
}

// tslint:disable-next-line:interface-name
export interface IAssessmentDetailsReportModel {
    key: string;
    displayName: string;
    steps: IRequirementReportModel[];
}

// tslint:disable-next-line:interface-name
export interface IOverviewSummaryReportModel {
    byRequirement: OutcomeStats;
    byPercentage: OutcomeStats;
    reportSummaryDetailsData: IAssessmentSummaryReportModel[];
}

// tslint:disable-next-line:interface-name
export interface IAssessmentSummaryReportStats extends OutcomeStats {}

// tslint:disable-next-line:interface-name
export interface IAssessmentSummaryReportModel extends IAssessmentSummaryReportStats {
    displayName: string;
}
export type RequirementType = 'manual' | 'assisted';
// tslint:disable-next-line:interface-name
export interface IRequirementHeaderReportModel {
    displayName: string;
    description: JSX.Element;
    guidanceLinks: HyperlinkDefinition[];
    requirementType: RequirementType;
}

// tslint:disable-next-line:interface-name
export interface IRequirementReportModel {
    key: string;
    header: IRequirementHeaderReportModel;
    instances: IInstanceReportModel[];
    defaultMessageComponent: DefaultMessageInterface;
    showPassingInstances: boolean;
}

// tslint:disable-next-line:interface-name
export interface IInstanceReportModel {
    props: IInstancePairReportModel[];
}

export type InstanceElementKey = 'Snippet' | 'Path' | 'Comment';

// tslint:disable-next-line:interface-name
export interface IInstancePairReportModel {
    key: InstanceElementKey;
    value: ColumnValue;
}
