// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultMessageInterface } from 'assessments/assessment-default-message-generator';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { ColumnValue } from 'common/types/property-bag/column-value-bag';

import { RequirementOutcomeStats } from './components/requirement-outcome-type';

export interface ReportModel {
    summary: OverviewSummaryReportModel;
    scanDetails: ScanDetailsReportModel;
    passedDetailsData: AssessmentDetailsReportModel[];
    failedDetailsData: AssessmentDetailsReportModel[];
    incompleteDetailsData: AssessmentDetailsReportModel[];
}

export interface ScanDetailsReportModel {
    targetPage: string;
    url: string;
    reportDate: Date;
}

export interface AssessmentDetailsReportModel {
    key: string;
    displayName: string;
    steps: RequirementReportModel[];
}

export interface OverviewSummaryReportModel {
    byRequirement: RequirementOutcomeStats;
    byPercentage: RequirementOutcomeStats;
    reportSummaryDetailsData: AssessmentSummaryReportModel[];
}

export interface AssessmentSummaryReportStats extends RequirementOutcomeStats {}

export interface AssessmentSummaryReportModel extends AssessmentSummaryReportStats {
    displayName: string;
}
export type RequirementType = 'manual' | 'assisted';

export interface RequirementHeaderReportModel {
    displayName: string;
    description: JSX.Element;
    guidanceLinks: HyperlinkDefinition[];
    requirementType: RequirementType;
}

export interface RequirementReportModel {
    key: string;
    header: RequirementHeaderReportModel;
    instances: InstanceReportModel[];
    defaultMessageComponent: DefaultMessageInterface;
    showPassingInstances: boolean;
}

export interface InstanceReportModel {
    props: InstancePairReportModel[];
}

export type InstanceElementKey = 'Snippet' | 'Path' | 'Comment';

export interface InstancePairReportModel {
    key: InstanceElementKey;
    value: ColumnValue;
}
