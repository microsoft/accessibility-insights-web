// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
} from '../../../injected/scanner-utils';
import { TabOrderPropertyBag } from '../../../injected/tab-order-property-bag';
import { TabStopEvent } from '../../../injected/tab-stops-listener';
import { ScanResults } from '../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../types/common-types';

interface ScanResultData<TSelector> {
    fullAxeResultsMap: DictionaryStringTo<TSelector>;
    scanResult?: ScanResults;
}

interface IssuesScanResultData extends ScanResultData<HtmlElementAxeResults> {
    selectedAxeResultsMap: DictionaryStringTo<HtmlElementAxeResults>;
    selectedIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult>;
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
