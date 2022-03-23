// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from 'injected/scanner-utils';
import { TabOrderPropertyBag } from 'injected/tab-order-property-bag';
import { ScanResults } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

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
}
