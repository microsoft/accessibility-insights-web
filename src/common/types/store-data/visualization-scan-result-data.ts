// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanResults, Target } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';
import { AdHocTestkeys } from './adhoc-test-keys';
import { GuidanceLink } from './guidance-links';
import { TabOrderPropertyBag } from './tab-order-property-bag';
import { TabStopEvent } from './tab-stop-event';

export interface FormattedCheckResult {
    id: string;
    message: string;
    data: any;
    relatedNodes?: AxeRelatedNode[];
}

export interface AxeRelatedNode {
    target: (string | string[])[];
    html: string;
}

export interface CheckData {
    // tslint:disable-next-line: no-reserved-keywords
    any?: FormattedCheckResult[];
    none?: FormattedCheckResult[];
    all?: FormattedCheckResult[];
}

export type DecoratedAxeNodeResult = {
    status?: boolean;
    ruleId: string;
    failureSummary?: string;
    selector: string;
    html?: string;
    help?: string;
    id?: string;
    guidanceLinks?: GuidanceLink[];
    helpUrl?: string;
} & CheckData;

export interface HtmlElementAxeResults {
    ruleResults: DictionaryStringTo<DecoratedAxeNodeResult>;
    propertyBag?: any;
    target: Target;
}

interface IssuesScanResultData {
    scanResult?: ScanResults;
    fullAxeResultsMap: DictionaryStringTo<HtmlElementAxeResults>;
    fullIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult>;
}

export interface TabbedElementData extends TabStopEvent {
    tabOrder: number;
    propertyBag?: TabOrderPropertyBag;
    instanceId: string;
}

export enum TabStopRequirementStatuses {
    pass = 'pass',
    fail = 'fail',
    unknown = 'unknown',
}

export type TabStopRequirementStatus = keyof typeof TabStopRequirementStatuses;

export type TabStopRequirementInstance = {
    description: string;
    id: string;
    selector?: string[];
    html?: string;
};

export type SingleTabStopRequirementState = {
    status: TabStopRequirementStatus;
    instances: TabStopRequirementInstance[];
    isExpanded: boolean;
};

export type TabStopRequirementState = {
    [requirementId: string]: SingleTabStopRequirementState;
};

export interface TabStopsScanResultData {
    tabbedElements: TabbedElementData[];
    requirements?: TabStopRequirementState;
    tabbingCompleted: boolean;
    needToCollectTabbingResults: boolean;
}

export interface VisualizationScanResultData {
    [AdHocTestkeys.Issues]: IssuesScanResultData;
    [AdHocTestkeys.Landmarks]: IssuesScanResultData;
    [AdHocTestkeys.Headings]: IssuesScanResultData;
    [AdHocTestkeys.Color]: IssuesScanResultData;
    [AdHocTestkeys.TabStops]: TabStopsScanResultData;
    [AdHocTestkeys.AccessibleNames]: IssuesScanResultData;
}
