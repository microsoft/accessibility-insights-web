// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult, IHtmlElementAxeResults } from '../../../injected/scanner-utils';
import { ITabOrderPropertyBag } from '../../../injected/tab-order-property-bag';
import { ITabStopEvent } from '../../../injected/tab-stops-listener';

interface IScanResultData<TSelector> {
    fullAxeResultsMap: IDictionaryStringTo<TSelector>;
    scanResult?: ScanResults;
}

export interface IIssuesScanResultData extends IScanResultData<IHtmlElementAxeResults> {
    selectedAxeResultsMap: IDictionaryStringTo<IHtmlElementAxeResults>;
    selectedIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
    fullIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
}

export interface ITabbedElementData extends ITabStopEvent {
    tabOrder: number;
    propertyBag?: ITabOrderPropertyBag;
}

export interface ITabStopsScanResultData {
    tabbedElements: ITabbedElementData[];
}

export interface IVisualizationScanResultData {
    issues: IIssuesScanResultData;
    landmarks: IIssuesScanResultData;
    headings: IIssuesScanResultData;
    color: IIssuesScanResultData;
    tabStops: ITabStopsScanResultData;
}
