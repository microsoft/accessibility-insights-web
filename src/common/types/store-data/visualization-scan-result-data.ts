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
}

export enum TabStopRequirementStatuses {
    pass = 'pass',
    fail = 'fail',
    unknown = 'unknown',
}

export type TabStopRequirementStatus = keyof typeof TabStopRequirementStatuses;

export type TabStopRequirementState = {
    [requirementId: string]: {
        status: TabStopRequirementStatus;
        instances: {
            description: string;
            id: string;
        }[];
        isExpanded: boolean;
    };
};

interface TabStopsScanResultData {
    tabbedElements: TabbedElementData[];
    requirements?: TabStopRequirementState;
}

export interface VisualizationScanResultData {
    [AdHocTestkeys.Issues]: IssuesScanResultData;
    [AdHocTestkeys.Landmarks]: IssuesScanResultData;
    [AdHocTestkeys.Headings]: IssuesScanResultData;
    [AdHocTestkeys.Color]: IssuesScanResultData;
    [AdHocTestkeys.TabStops]: TabStopsScanResultData;
}
