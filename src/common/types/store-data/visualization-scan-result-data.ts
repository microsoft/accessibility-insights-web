// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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

interface TabStopsScanResultData {
    tabbedElements: TabbedElementData[];
}

export interface VisualizationScanResultData {
    issues: IssuesScanResultData;
    landmarks: IssuesScanResultData;
    headings: IssuesScanResultData;
    color: IssuesScanResultData;
    tabStops: TabStopsScanResultData;
}
